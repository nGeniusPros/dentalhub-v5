-- Create enum types
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE report_status AS ENUM ('pending', 'completed');
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'patient');

-- Create patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    address JSONB,
    medical_history JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    staff_id UUID REFERENCES auth.users(id),
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status appointment_status NOT NULL DEFAULT 'scheduled',
    type VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    appointment_id UUID REFERENCES appointments(id),
    amount DECIMAL(10,2) NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    payment_date TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    staff_id UUID REFERENCES auth.users(id),
    type VARCHAR(255) NOT NULL,
    status report_status NOT NULL DEFAULT 'pending',
    content JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_staff_id ON appointments(staff_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_payments_patient_id ON payments(patient_id);
CREATE INDEX idx_payments_appointment_id ON payments(appointment_id);
CREATE INDEX idx_reports_patient_id ON reports(patient_id);
CREATE INDEX idx_reports_staff_id ON reports(staff_id);

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating updated_at
CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for patients
CREATE POLICY "Enable read access for authenticated users" ON patients
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff') OR auth.uid() = user_id);

CREATE POLICY "Enable insert access for staff and admin" ON patients
    FOR INSERT
    WITH CHECK (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable update access for staff and admin" ON patients
    FOR UPDATE
    USING (auth.role() IN ('admin', 'staff'));

-- Create RLS policies for appointments
CREATE POLICY "Enable read access for authenticated users" ON appointments
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff') OR auth.uid() IN (
        SELECT user_id FROM patients WHERE id = appointments.patient_id
    ));

CREATE POLICY "Enable insert access for staff and admin" ON appointments
    FOR INSERT
    WITH CHECK (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable update access for staff and admin" ON appointments
    FOR UPDATE
    USING (auth.role() IN ('admin', 'staff'));

-- Create RLS policies for payments
CREATE POLICY "Enable read access for authenticated users" ON payments
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff') OR auth.uid() IN (
        SELECT user_id FROM patients WHERE id = payments.patient_id
    ));

CREATE POLICY "Enable insert access for staff and admin" ON payments
    FOR INSERT
    WITH CHECK (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable update access for staff and admin" ON payments
    FOR UPDATE
    USING (auth.role() IN ('admin', 'staff'));

-- Create RLS policies for reports
CREATE POLICY "Enable read access for authenticated users" ON reports
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff') OR auth.uid() IN (
        SELECT user_id FROM patients WHERE id = reports.patient_id
    ));

CREATE POLICY "Enable insert access for staff and admin" ON reports
    FOR INSERT
    WITH CHECK (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable update access for staff and admin" ON reports
    FOR UPDATE
    USING (auth.role() IN ('admin', 'staff'));