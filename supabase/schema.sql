-- Supabase Postgres Schema for Naukri Profile Optimizer
-- Compliant with India DPDP Act 2023 & Row Level Security (RLS)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  name TEXT,
  email TEXT,
  target_role TEXT,
  target_role_id TEXT,
  experience_band TEXT,
  target_cities JSONB DEFAULT '[]'::jsonb,
  parsed JSONB,
  raw_text TEXT,
  score INTEGER DEFAULT 0,
  completeness INTEGER DEFAULT 0,
  components JSONB,
  keywords JSONB,
  action_plan JSONB,
  is_anonymous BOOLEAN DEFAULT true,
  share_token TEXT UNIQUE,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published score cards via share_token
CREATE POLICY "Public profiles can be viewed via share_token" ON profiles
  FOR SELECT USING (is_published = true AND share_token IS NOT NULL);

-- Allow users to read and update their own profiles or anonymous guest access
CREATE POLICY "Users can manage their own profiles" ON profiles
  FOR ALL USING (auth.uid() = user_id OR (user_id IS NULL AND is_anonymous = true));

-- 2. Rewrites Table
CREATE TABLE IF NOT EXISTS rewrites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  section TEXT,
  original TEXT,
  suggested TEXT,
  variant TEXT, -- SAFE | METRIC | IMPACT
  reason TEXT,
  status TEXT DEFAULT 'pending', -- pending | accepted | rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE rewrites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own rewrites" ON rewrites
  FOR ALL USING (
    profile_id IN (SELECT id FROM profiles WHERE auth.uid() = user_id OR user_id IS NULL)
  );

-- 3. Job Fits Table
CREATE TABLE IF NOT EXISTS job_fits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  jd_hash TEXT,
  jd_text TEXT,
  match_score INTEGER,
  breakdown JSONB,
  verdict TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE job_fits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own job fits" ON job_fits
  FOR ALL USING (
    profile_id IN (SELECT id FROM profiles WHERE auth.uid() = user_id OR user_id IS NULL)
  );

-- 4. Score History Table
CREATE TABLE IF NOT EXISTS score_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER,
  components JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE score_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view score history" ON score_history
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE auth.uid() = user_id OR user_id IS NULL)
  );

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company TEXT,
  role TEXT,
  match_score INTEGER,
  status TEXT, -- applied | screened | rejected | interviewing | offer
  rejection_reason TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their applications" ON applications
  FOR ALL USING (
    profile_id IN (SELECT id FROM profiles WHERE auth.uid() = user_id OR user_id IS NULL)
  );

-- 6. User Consents Table (DPDP Act 2023 Compliance)
CREATE TABLE IF NOT EXISTS user_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  scope TEXT NOT NULL,              -- 'ai_processing' | 'analytics' | 'marketing'
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  version TEXT NOT NULL             -- consent text version
);

ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their consents" ON user_consents
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_share_token ON profiles(share_token);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_rewrites_profile_id ON rewrites(profile_id);
CREATE INDEX IF NOT EXISTS idx_job_fits_profile_id ON job_fits(profile_id);

-- 7. 24-Hour Auto-Purge Function for Anonymous Data Minimization (DPDP compliance)
CREATE OR REPLACE FUNCTION purge_old_anonymous_profiles()
RETURNS void AS $$
BEGIN
  DELETE FROM profiles
  WHERE created_at < NOW() - INTERVAL '24 hours'
    AND is_anonymous = true;
END;
$$ LANGUAGE plpgsql;
