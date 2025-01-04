-- Create enum types
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'voided');
CREATE TYPE payment_method AS ENUM ('cash', 'credit_card', 'debit_card', 'check', 'insurance', 'other');
CREATE TYPE claim_status AS ENUM ('draft', 'submitted', 'in_review', 'approved', 'denied', 'appealed', 'closed');
CREATE TYPE insurance_verification_status AS ENUM ('pending', 'verified', 'inactive', 'expired');

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id),
    appointment_id UUID,
    amount DECIMAL(10,2) NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    method payment_method NOT NULL,
    transaction_id VARCHAR(255),
    reference_number VARCHAR(255),
    payment_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create insurance_providers table
CREATE TABLE insurance_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    payer_id VARCHAR(100),
    address JSONB,
    contact_info JSONB,
    api_credentials JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create patient_insurance table
CREATE TABLE patient_insurance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id),
    provider_id UUID REFERENCES insurance_providers(id),
    policy_number VARCHAR(100) NOT NULL,
    group_number VARCHAR(100),
    subscriber_id VARCHAR(100),
    subscriber_name VARCHAR(255),
    relationship_to_subscriber VARCHAR(50),
    coverage_start_date DATE,
    coverage_end_date DATE,
    verification_status insurance_verification_status DEFAULT 'pending',
    last_verified_at TIMESTAMP WITH TIME ZONE,
    benefits_summary JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create insurance_claims table
CREATE TABLE insurance_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id),
    provider_id UUID REFERENCES insurance_providers(id),
    appointment_id UUID,
    claim_number VARCHAR(100),
    status claim_status NOT NULL DEFAULT 'draft',
    submission_date TIMESTAMP WITH TIME ZONE,
    service_date DATE,
    total_amount DECIMAL(10,2) NOT NULL,
    covered_amount DECIMAL(10,2),
    patient_responsibility DECIMAL(10,2),
    diagnosis_codes TEXT[],
    procedure_codes TEXT[],
    attachments JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    response_details JSONB,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create claim_history table
CREATE TABLE claim_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID REFERENCES insurance_claims(id),
    status claim_status NOT NULL,
    notes TEXT,
    metadata JSONB,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create revenue_entries table
CREATE TABLE revenue_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    source VARCHAR(100),
    reference_id UUID,
    reference_type VARCHAR(50),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create accounts_receivable table
CREATE TABLE accounts_receivable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id),
    invoice_number VARCHAR(100),
    total_amount DECIMAL(10,2) NOT NULL,
    remaining_amount DECIMAL(10,2) NOT NULL,
    due_date DATE,
    last_payment_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50),
    aging_days INTEGER,
    collection_status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_plans table
CREATE TABLE payment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    remaining_amount DECIMAL(10,2) NOT NULL,
    installment_amount DECIMAL(10,2) NOT NULL,
    frequency VARCHAR(50),
    start_date DATE,
    end_date DATE,
    next_payment_date DATE,
    status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_payments_patient_id ON payments(patient_id);
CREATE INDEX idx_payments_appointment_id ON payments(appointment_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_patient_insurance_patient_id ON patient_insurance(patient_id);
CREATE INDEX idx_patient_insurance_provider_id ON patient_insurance(provider_id);
CREATE INDEX idx_insurance_claims_patient_id ON insurance_claims(patient_id);
CREATE INDEX idx_insurance_claims_provider_id ON insurance_claims(provider_id);
CREATE INDEX idx_insurance_claims_status ON insurance_claims(status);
CREATE INDEX idx_claim_history_claim_id ON claim_history(claim_id);
CREATE INDEX idx_revenue_entries_entry_date ON revenue_entries(entry_date);
CREATE INDEX idx_revenue_entries_category ON revenue_entries(category);
CREATE INDEX idx_accounts_receivable_patient_id ON accounts_receivable(patient_id);
CREATE INDEX idx_accounts_receivable_due_date ON accounts_receivable(due_date);
CREATE INDEX idx_payment_plans_patient_id ON payment_plans(patient_id);

-- Create triggers for updating updated_at
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_providers_updated_at
    BEFORE UPDATE ON insurance_providers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_insurance_updated_at
    BEFORE UPDATE ON patient_insurance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_claims_updated_at
    BEFORE UPDATE ON insurance_claims
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_entries_updated_at
    BEFORE UPDATE ON revenue_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_receivable_updated_at
    BEFORE UPDATE ON accounts_receivable
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_plans_updated_at
    BEFORE UPDATE ON payment_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts_receivable ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users" ON payments
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON insurance_providers
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON patient_insurance
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON insurance_claims
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON claim_history
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON revenue_entries
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON accounts_receivable
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable read access for authenticated users" ON payment_plans
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

-- Admin policies
CREATE POLICY "Enable full access for admins" ON payments
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Enable full access for admins" ON insurance_providers
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Enable full access for admins" ON patient_insurance
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Enable full access for admins" ON insurance_claims
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Enable full access for admins" ON claim_history
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Enable full access for admins" ON revenue_entries
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Enable full access for admins" ON accounts_receivable
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Enable full access for admins" ON payment_plans
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

-- Staff policies for payment processing
CREATE POLICY "Enable staff to process payments" ON payments
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.role() = 'staff');

CREATE POLICY "Enable staff to update payment status" ON payments
    FOR UPDATE
    USING (auth.role() = 'staff')
    WITH CHECK (auth.role() = 'staff');

-- Staff policies for insurance verification
CREATE POLICY "Enable staff to verify insurance" ON patient_insurance
    FOR UPDATE
    USING (auth.role() = 'staff')
    WITH CHECK (auth.role() = 'staff');

-- Staff policies for claims management
CREATE POLICY "Enable staff to manage claims" ON insurance_claims
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.role() = 'staff');

CREATE POLICY "Enable staff to update claims" ON insurance_claims
    FOR UPDATE
    USING (auth.role() = 'staff')
    WITH CHECK (auth.role() = 'staff');

-- Patient access policies
CREATE POLICY "Enable patients to view their own payments" ON payments
    FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Enable patients to view their own insurance" ON patient_insurance
    FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Enable patients to view their own claims" ON insurance_claims
    FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Enable patients to view their own payment plans" ON payment_plans
    FOR SELECT
    USING (auth.uid() = patient_id);