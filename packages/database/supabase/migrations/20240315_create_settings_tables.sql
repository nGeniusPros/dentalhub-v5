-- Create enum types
CREATE TYPE permission_type AS ENUM ('read', 'write', 'create', 'delete', 'manage');
CREATE TYPE setting_type AS ENUM ('string', 'number', 'boolean', 'json');

-- Create practice settings table
CREATE TABLE practice_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type setting_type NOT NULL DEFAULT 'string',
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user permissions table
CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    permission_key VARCHAR(255) NOT NULL,
    permission_type permission_type NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, permission_key)
);

-- Create system configuration table
CREATE TABLE system_configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(255) NOT NULL UNIQUE,
    config_value TEXT,
    config_type setting_type NOT NULL DEFAULT 'string',
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create integration settings table
CREATE TABLE integration_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_key VARCHAR(255) NOT NULL UNIQUE,
    settings_value TEXT,
    settings_type setting_type NOT NULL DEFAULT 'json',
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_practice_settings_key ON practice_settings(setting_key);
CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_key ON user_permissions(permission_key);
CREATE INDEX idx_system_configuration_key ON system_configuration(config_key);
CREATE INDEX idx_integration_settings_key ON integration_settings(integration_key);

-- Create triggers for updating updated_at
CREATE TRIGGER update_practice_settings_updated_at
    BEFORE UPDATE ON practice_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_permissions_updated_at
    BEFORE UPDATE ON user_permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_configuration_updated_at
    BEFORE UPDATE ON system_configuration
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_settings_updated_at
    BEFORE UPDATE ON integration_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE practice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Practice Settings
CREATE POLICY "Enable read access for authenticated users" ON practice_settings
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable full access for admins" ON practice_settings
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

-- User Permissions
CREATE POLICY "Enable read access for authenticated users" ON user_permissions
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable full access for admins" ON user_permissions
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

-- System Configuration
CREATE POLICY "Enable read access for authenticated users" ON system_configuration
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable full access for admins" ON system_configuration
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

-- Integration Settings
CREATE POLICY "Enable read access for authenticated users" ON integration_settings
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable full access for admins" ON integration_settings
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

-- User Profiles
CREATE POLICY "Users can read own profile"
ON "profiles"
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON "profiles"
FOR UPDATE USING (auth.uid() = id);

-- Staff Access
CREATE POLICY "Staff read access"
ON "appointments"
FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM staff_profiles
    WHERE role IN ('staff', 'admin')
  )
);

-- Admin Access
CREATE POLICY "Admin full access"
ON "ALL TABLES"
FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM staff_profiles
    WHERE role = 'admin'
  )
);