-- Create enum types
CREATE TYPE campaign_type AS ENUM ('email', 'sms', 'voice');
CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'active', 'paused', 'completed', 'failed');
CREATE TYPE delivery_status AS ENUM ('pending', 'sent', 'delivered', 'failed');
CREATE TYPE engagement_type AS ENUM ('open', 'click', 'reply', 'unsubscribe', 'bounce');

-- Create campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type campaign_type NOT NULL,
    status campaign_status NOT NULL DEFAULT 'draft',
    schedule JSONB,
    audience JSONB NOT NULL,
    content JSONB NOT NULL,
    settings JSONB,
    metrics JSONB NOT NULL DEFAULT '{
        "total": 0,
        "sent": 0,
        "delivered": 0,
        "engaged": 0,
        "failed": 0
    }'::jsonb,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create campaign_deliveries table
CREATE TABLE campaign_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES patients(id),
    status delivery_status NOT NULL DEFAULT 'pending',
    provider_message_id VARCHAR(255),
    metadata JSONB,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create campaign_engagements table
CREATE TABLE campaign_engagements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    delivery_id UUID REFERENCES campaign_deliveries(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES patients(id),
    type engagement_type NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create campaign_analytics table
CREATE TABLE campaign_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    metrics JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_campaigns_type_status ON campaigns(type, status);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at);
CREATE INDEX idx_campaign_deliveries_campaign_id ON campaign_deliveries(campaign_id);
CREATE INDEX idx_campaign_deliveries_recipient_id ON campaign_deliveries(recipient_id);
CREATE INDEX idx_campaign_deliveries_status ON campaign_deliveries(status);
CREATE INDEX idx_campaign_engagements_campaign_id ON campaign_engagements(campaign_id);
CREATE INDEX idx_campaign_engagements_delivery_id ON campaign_engagements(delivery_id);
CREATE INDEX idx_campaign_engagements_recipient_id ON campaign_engagements(recipient_id);
CREATE INDEX idx_campaign_engagements_type ON campaign_engagements(type);
CREATE INDEX idx_campaign_analytics_campaign_id ON campaign_analytics(campaign_id);
CREATE INDEX idx_campaign_analytics_timestamp ON campaign_analytics(timestamp);

-- Create triggers for updating updated_at
CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_deliveries_updated_at
    BEFORE UPDATE ON campaign_deliveries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for campaigns
CREATE POLICY "Enable read access for authenticated users" ON campaigns
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable insert/update for staff and admin" ON campaigns
    FOR ALL
    USING (auth.role() IN ('admin', 'staff'))
    WITH CHECK (auth.role() IN ('admin', 'staff'));

-- RLS policies for campaign_deliveries
CREATE POLICY "Enable read access for authenticated users" ON campaign_deliveries
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable insert/update for staff and admin" ON campaign_deliveries
    FOR ALL
    USING (auth.role() IN ('admin', 'staff'))
    WITH CHECK (auth.role() IN ('admin', 'staff'));

-- RLS policies for campaign_engagements
CREATE POLICY "Enable read access for authenticated users" ON campaign_engagements
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable insert/update for staff and admin" ON campaign_engagements
    FOR ALL
    USING (auth.role() IN ('admin', 'staff'))
    WITH CHECK (auth.role() IN ('admin', 'staff'));

-- RLS policies for campaign_analytics
CREATE POLICY "Enable read access for authenticated users" ON campaign_analytics
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable insert/update for staff and admin" ON campaign_analytics
    FOR ALL
    USING (auth.role() IN ('admin', 'staff'))
    WITH CHECK (auth.role() IN ('admin', 'staff'));