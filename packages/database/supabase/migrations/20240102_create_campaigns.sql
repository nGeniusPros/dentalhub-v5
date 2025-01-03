-- Create enum types for campaign status and type
CREATE TYPE campaign_type AS ENUM ('voice', 'sms', 'email');
CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'active', 'paused', 'completed', 'failed');

-- Create campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type campaign_type NOT NULL,
    status campaign_status NOT NULL DEFAULT 'draft',
    schedule JSONB,
    audience JSONB NOT NULL,
    content JSONB NOT NULL,
    metrics JSONB NOT NULL DEFAULT '{
        "total": 0,
        "sent": 0,
        "delivered": 0,
        "engaged": 0,
        "failed": 0
    }'::jsonb,
    settings JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_campaigns_type_status ON campaigns(type, status);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Policy for select
CREATE POLICY "Enable read access for authenticated users" ON campaigns
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policy for insert
CREATE POLICY "Enable insert access for authenticated users" ON campaigns
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Policy for update
CREATE POLICY "Enable update access for authenticated users" ON campaigns
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Policy for delete
CREATE POLICY "Enable delete access for authenticated users" ON campaigns
    FOR DELETE
    USING (auth.role() = 'authenticated');