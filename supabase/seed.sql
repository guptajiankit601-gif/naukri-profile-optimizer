-- Seed data for Naukri Profile Optimizer
-- Seed Indian candidate personas: Arjun Sharma, Priya Patel, Sneha Kulkarni

INSERT INTO profiles (
  id,
  name,
  email,
  target_role,
  target_role_id,
  experience_band,
  target_cities,
  score,
  completeness,
  is_anonymous,
  share_token,
  is_published,
  created_at
) VALUES 
(
  'a1111111-1111-1111-1111-111111111111',
  'Arjun Sharma',
  'backend@demo.npo.internal',
  'Software Engineer — Backend / Full-stack',
  'backend-engineer',
  '3-5',
  '["Bengaluru", "Hyderabad"]'::jsonb,
  68,
  70,
  false,
  'share-arjun-backend',
  true,
  NOW()
),
(
  'b2222222-2222-2222-2222-222222222222',
  'Priya Patel',
  'student@demo.npo.internal',
  'B.Tech Fresher / Campus Candidate',
  'campus-fresher',
  '0-1',
  '["Hyderabad", "Pune"]'::jsonb,
  42,
  45,
  false,
  'share-priya-fresher',
  true,
  NOW()
),
(
  'c3333333-3333-3333-3333-333333333333',
  'Sneha Kulkarni',
  'marketing@demo.npo.internal',
  'Digital Marketing Executive / Growth',
  'digital-marketing',
  '5-8',
  '["Mumbai", "Bengaluru"]'::jsonb,
  61,
  64,
  false,
  'share-sneha-growth',
  true,
  NOW()
)
ON CONFLICT (id) DO NOTHING;
