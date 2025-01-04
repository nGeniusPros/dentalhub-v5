-- Create enum types
CREATE TYPE template_type AS ENUM ('email', 'sms');
CREATE TYPE template_status AS ENUM ('active', 'inactive', 'archived');

-- Create email templates table
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    variables JSONB NOT NULL DEFAULT '[]'::jsonb,
    status template_status NOT NULL DEFAULT 'active',
    category VARCHAR(50),
    preview_text VARCHAR(255),
    metadata JSONB,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create SMS templates table
CREATE TABLE sms_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    variables JSONB NOT NULL DEFAULT '[]'::jsonb,
    status template_status NOT NULL DEFAULT 'active',
    category VARCHAR(50),
    metadata JSONB,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_email_templates_status ON email_templates(status);
CREATE INDEX idx_email_templates_category ON email_templates(category);
CREATE INDEX idx_sms_templates_status ON sms_templates(status);
CREATE INDEX idx_sms_templates_category ON sms_templates(category);

-- Create triggers for updating updated_at
CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sms_templates_updated_at
    BEFORE UPDATE ON sms_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for email templates
CREATE POLICY "Enable read access for authenticated users" ON email_templates
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable insert/update for staff and admin" ON email_templates
    FOR ALL
    USING (auth.role() IN ('admin', 'staff'))
    WITH CHECK (auth.role() IN ('admin', 'staff'));

-- RLS policies for SMS templates
CREATE POLICY "Enable read access for authenticated users" ON sms_templates
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable insert/update for staff and admin" ON sms_templates
    FOR ALL
    USING (auth.role() IN ('admin', 'staff'))
    WITH CHECK (auth.role() IN ('admin', 'staff'));

-- Insert default email templates
INSERT INTO email_templates (name, subject, content, variables, category) VALUES
(
    'Welcome Email',
    'Welcome to Our Dental Practice',
    '<h1>Welcome {{patient_name}}!</h1>
    <p>Thank you for choosing our dental practice. We''re excited to have you as a patient!</p>
    <p>Your first appointment is scheduled for {{appointment_date}} at {{appointment_time}}.</p>
    <p>If you need to reschedule or have any questions, please call us at {{practice_phone}}.</p>',
    '[
        {"name": "patient_name", "type": "string", "required": true},
        {"name": "appointment_date", "type": "date", "required": true},
        {"name": "appointment_time", "type": "time", "required": true},
        {"name": "practice_phone", "type": "string", "required": true}
    ]',
    'onboarding'
),
(
    'Appointment Reminder',
    'Reminder: Your Dental Appointment',
    '<h2>Appointment Reminder</h2>
    <p>Dear {{patient_name}},</p>
    <p>This is a reminder that you have an appointment scheduled for {{appointment_date}} at {{appointment_time}}.</p>
    <p>Please arrive 10 minutes early to complete any necessary paperwork.</p>
    <p>If you need to reschedule, please call {{practice_phone}} at least 24 hours in advance.</p>',
    '[
        {"name": "patient_name", "type": "string", "required": true},
        {"name": "appointment_date", "type": "date", "required": true},
        {"name": "appointment_time", "type": "time", "required": true},
        {"name": "practice_phone", "type": "string", "required": true}
    ]',
    'appointments'
);

-- Insert default SMS templates
INSERT INTO sms_templates (name, content, variables, category) VALUES
(
    'Appointment Reminder',
    'Hi {{patient_name}}, this is a reminder about your dental appointment on {{appointment_date}} at {{appointment_time}}. Please reply Y to confirm or call {{practice_phone}} to reschedule.',
    '[
        {"name": "patient_name", "type": "string", "required": true},
        {"name": "appointment_date", "type": "date", "required": true},
        {"name": "appointment_time", "type": "time", "required": true},
        {"name": "practice_phone", "type": "string", "required": true}
    ]',
    'appointments'
),
(
    'Follow Up',
    'Hi {{patient_name}}, how are you feeling after your recent dental procedure? If you''re experiencing any issues, please call us at {{practice_phone}}.',
    '[
        {"name": "patient_name", "type": "string", "required": true},
        {"name": "practice_phone", "type": "string", "required": true}
    ]',
    'follow_up'
);