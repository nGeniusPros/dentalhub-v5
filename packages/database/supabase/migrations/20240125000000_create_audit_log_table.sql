-- Create audit log table
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id),
    action_type TEXT NOT NULL,
    target_user_id UUID REFERENCES auth.users(id),
    old_role TEXT,
    new_role TEXT,
    details JSONB
);

COMMENT ON TABLE audit_log IS 'Tracks security-sensitive system actions';
COMMENT ON COLUMN audit_log.action_type IS 'Type of action (e.g., ROLE_UPDATE)';
COMMENT ON COLUMN audit_log.target_user_id IS 'User affected by the action';