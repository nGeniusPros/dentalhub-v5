-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'dentist', 'hygienist', 'staff')),
  practice_id VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;