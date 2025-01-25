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

-- Create patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practice_id VARCHAR(20) NOT NULL,
  firstName VARCHAR NOT NULL,
  lastName VARCHAR NOT NULL,
  dateOfBirth DATE NOT NULL,
  insuranceId UUID,
  medical_history JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX patients_practice_id_unique ON patients (practice_id);
CREATE INDEX patients_practice_id_idx ON patients (practice_id);