-- Supabase Postgres Schema for Naukri Profile Optimizer

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewrites table
CREATE TABLE IF NOT EXISTS rewrites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  section TEXT,
  original TEXT,
  suggested TEXT,
  variant TEXT,
  reason TEXT,
  status TEXT DEFAULT 'pending', -- pending | accepted | rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job fits table
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

-- Score history table
CREATE TABLE IF NOT EXISTS score_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER,
  components JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
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

-- User Consents table (DPDP Act 2023 & Section 8.2)
CREATE TABLE IF NOT EXISTS user_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  scope TEXT NOT NULL,              -- 'ai_processing' | 'analytics' | 'marketing'
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  version TEXT NOT NULL             -- consent text version, for legal audit
);

-- 24-hour Auto-Purge Cron function for Anonymous Data Minimization (DPDP compliance)
CREATE OR REPLACE FUNCTION purge_old_anonymous_profiles()
RETURNS void AS $$
BEGIN
  DELETE FROM profiles
  WHERE created_at < NOW() - INTERVAL '24 hours'
    AND is_anonymous = true;
END;
$$ LANGUAGE plpgsql;
