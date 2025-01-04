-- Create enum types
CREATE TYPE staff_role AS ENUM ('dentist', 'hygienist', 'assistant', 'receptionist', 'admin');
CREATE TYPE performance_metric AS ENUM ('productivity', 'patient_satisfaction', 'attendance', 'quality', 'efficiency');
CREATE TYPE training_status AS ENUM ('not_started', 'in_progress', 'completed', 'expired');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- Create staff profiles table
CREATE TABLE staff_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role staff_role NOT NULL,
    specialization VARCHAR(255),
    license_number VARCHAR(100),
    license_expiry DATE,
    certifications JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    bio TEXT,
    contact_info JSONB,
    emergency_contact JSONB,
    hire_date DATE NOT NULL,
    termination_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create staff performance table
CREATE TABLE staff_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE CASCADE,
    metric performance_metric NOT NULL,
    value DECIMAL(5,2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    notes TEXT,
    evaluated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create staff schedule table
CREATE TABLE staff_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    location VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, day_of_week)
);

-- Create staff training table
CREATE TABLE staff_training (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) NOT NULL,
    status training_status NOT NULL DEFAULT 'not_started',
    due_date DATE,
    completion_date DATE,
    certification_url TEXT,
    validity_period INTEGER, -- in months
    materials_url TEXT,
    assigned_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create staff tasks table
CREATE TABLE staff_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority task_priority NOT NULL DEFAULT 'medium',
    status task_status NOT NULL DEFAULT 'pending',
    due_date TIMESTAMP WITH TIME ZONE,
    completion_date TIMESTAMP WITH TIME ZONE,
    assigned_by UUID REFERENCES auth.users(id),
    category VARCHAR(100),
    tags JSONB DEFAULT '[]'::jsonb,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create staff task comments table
CREATE TABLE staff_task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES staff_tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_staff_profiles_user_id ON staff_profiles(user_id);
CREATE INDEX idx_staff_profiles_role ON staff_profiles(role);
CREATE INDEX idx_staff_profiles_status ON staff_profiles(status);
CREATE INDEX idx_staff_performance_staff_id ON staff_performance(staff_id);
CREATE INDEX idx_staff_performance_period ON staff_performance(period_start, period_end);
CREATE INDEX idx_staff_schedules_staff_id ON staff_schedules(staff_id);
CREATE INDEX idx_staff_schedules_day ON staff_schedules(day_of_week);
CREATE INDEX idx_staff_training_staff_id ON staff_training(staff_id);
CREATE INDEX idx_staff_training_status ON staff_training(status);
CREATE INDEX idx_staff_training_due_date ON staff_training(due_date);
CREATE INDEX idx_staff_tasks_staff_id ON staff_tasks(staff_id);
CREATE INDEX idx_staff_tasks_status ON staff_tasks(status);
CREATE INDEX idx_staff_tasks_due_date ON staff_tasks(due_date);
CREATE INDEX idx_staff_task_comments_task_id ON staff_task_comments(task_id);

-- Create triggers for updating updated_at
CREATE TRIGGER update_staff_profiles_updated_at
    BEFORE UPDATE ON staff_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_performance_updated_at
    BEFORE UPDATE ON staff_performance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_schedules_updated_at
    BEFORE UPDATE ON staff_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_training_updated_at
    BEFORE UPDATE ON staff_training
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_tasks_updated_at
    BEFORE UPDATE ON staff_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_task_comments_updated_at
    BEFORE UPDATE ON staff_task_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_task_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users" ON staff_profiles
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON staff_performance
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON staff_schedules
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON staff_training
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON staff_tasks
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON staff_task_comments
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

-- Admin policies
CREATE POLICY "Enable full access for admins" ON staff_profiles
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Enable full access for admins" ON staff_performance
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Enable full access for admins" ON staff_schedules
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Enable full access for admins" ON staff_training
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Enable full access for admins" ON staff_tasks
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Enable full access for admins" ON staff_task_comments
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

-- Staff self-access policies
CREATE POLICY "Enable staff to view and update their own profile" ON staff_profiles
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable staff to view their own performance" ON staff_performance
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM staff_profiles WHERE id = staff_id));

CREATE POLICY "Enable staff to view and update their own schedule" ON staff_schedules
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM staff_profiles WHERE id = staff_id))
    WITH CHECK (auth.uid() IN (SELECT user_id FROM staff_profiles WHERE id = staff_id));

CREATE POLICY "Enable staff to view and update their own training" ON staff_training
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM staff_profiles WHERE id = staff_id))
    WITH CHECK (auth.uid() IN (SELECT user_id FROM staff_profiles WHERE id = staff_id));

CREATE POLICY "Enable staff to view and update their own tasks" ON staff_tasks
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM staff_profiles WHERE id = staff_id))
    WITH CHECK (auth.uid() IN (SELECT user_id FROM staff_profiles WHERE id = staff_id));

CREATE POLICY "Enable staff to create and view task comments" ON staff_task_comments
    FOR ALL
    USING (auth.role() IN ('admin', 'staff'))
    WITH CHECK (auth.role() IN ('admin', 'staff'));