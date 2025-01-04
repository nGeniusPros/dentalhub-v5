-- Create enum types
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE appointment_type AS ENUM ('consultation', 'cleaning', 'filling', 'root_canal', 'extraction', 'crown', 'bridge', 'implant', 'orthodontics', 'other');
CREATE TYPE resource_type AS ENUM ('room', 'equipment', 'staff');
CREATE TYPE reminder_type AS ENUM ('email', 'sms', 'both');
CREATE TYPE reminder_status AS ENUM ('pending', 'sent', 'failed');

-- Create appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES auth.users(id),
    type appointment_type NOT NULL,
    status appointment_status NOT NULL DEFAULT 'scheduled',
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    notes TEXT,
    reason TEXT,
    cancellation_reason TEXT,
    cancellation_time TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID REFERENCES auth.users(id),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create appointment resources table
CREATE TABLE appointment_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL,
    resource_type resource_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(appointment_id, resource_id, resource_type)
);

-- Create resources table
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type resource_type NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'available',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create appointment comments table
CREATE TABLE appointment_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create appointment reminders table
CREATE TABLE appointment_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    type reminder_type NOT NULL,
    status reminder_status NOT NULL DEFAULT 'pending',
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_time TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create appointment availability table
CREATE TABLE appointment_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES auth.users(id),
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider_id, day_of_week)
);

-- Create appointment blackout dates table
CREATE TABLE appointment_blackout_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES auth.users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointment_resources_appointment_id ON appointment_resources(appointment_id);
CREATE INDEX idx_appointment_resources_resource_id ON appointment_resources(resource_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_appointment_comments_appointment_id ON appointment_comments(appointment_id);
CREATE INDEX idx_appointment_reminders_appointment_id ON appointment_reminders(appointment_id);
CREATE INDEX idx_appointment_reminders_status ON appointment_reminders(status);
CREATE INDEX idx_appointment_availability_provider_id ON appointment_availability(provider_id);
CREATE INDEX idx_appointment_blackout_dates_provider_id ON appointment_blackout_dates(provider_id);
CREATE INDEX idx_appointment_blackout_dates_dates ON appointment_blackout_dates(start_date, end_date);

-- Create triggers for updating updated_at
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointment_resources_updated_at
    BEFORE UPDATE ON appointment_resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointment_comments_updated_at
    BEFORE UPDATE ON appointment_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointment_reminders_updated_at
    BEFORE UPDATE ON appointment_reminders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointment_availability_updated_at
    BEFORE UPDATE ON appointment_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointment_blackout_dates_updated_at
    BEFORE UPDATE ON appointment_blackout_dates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_blackout_dates ENABLE ROW LEVEL SECURITY;

-- RLS policies for appointments
CREATE POLICY "Enable read access for authenticated users" ON appointments
    FOR SELECT
    USING (
        auth.role() IN ('admin', 'staff') OR 
        auth.uid() = patient_id OR 
        auth.uid() = provider_id
    );

CREATE POLICY "Enable insert/update for staff and admin" ON appointments
    FOR ALL
    USING (auth.role() IN ('admin', 'staff'))
    WITH CHECK (auth.role() IN ('admin', 'staff'));

-- Similar RLS policies for other tables
CREATE POLICY "Enable read access for authenticated users" ON appointment_resources
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON resources
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON appointment_comments
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON appointment_reminders
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON appointment_availability
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON appointment_blackout_dates
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

-- Insert default resources
INSERT INTO resources (name, type, metadata) VALUES
('Room 1', 'room', '{"capacity": 1, "equipment": ["dental_chair", "x_ray"]}'),
('Room 2', 'room', '{"capacity": 1, "equipment": ["dental_chair"]}'),
('Room 3', 'room', '{"capacity": 1, "equipment": ["dental_chair", "x_ray"]}'),
('X-Ray Machine 1', 'equipment', '{"type": "x_ray", "model": "DX-3000"}'),
('Dental Chair 1', 'equipment', '{"type": "chair", "model": "DC-2000"}'),
('Dental Chair 2', 'equipment', '{"type": "chair", "model": "DC-2000"}'),
('Dental Chair 3', 'equipment', '{"type": "chair", "model": "DC-2000"}');