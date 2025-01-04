-- Create enum types
CREATE TYPE relationship_type AS ENUM ('spouse', 'child', 'parent', 'sibling', 'other');
CREATE TYPE document_type AS ENUM ('treatment_plan', 'x_ray', 'prescription', 'insurance', 'consent_form', 'other');
CREATE TYPE treatment_status AS ENUM ('planned', 'in_progress', 'completed', 'cancelled');

-- Create family relationships table
CREATE TABLE family_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    related_patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    relationship_type relationship_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(patient_id, related_patient_id)
);

-- Create patient documents table
CREATE TABLE patient_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    type document_type NOT NULL,
    file_path TEXT NOT NULL,
    description TEXT,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create treatment plans table
CREATE TABLE treatment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    procedures JSONB NOT NULL,
    estimated_cost DECIMAL(10,2),
    duration VARCHAR(255),
    status treatment_status NOT NULL DEFAULT 'planned',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_family_relationships_patient_id ON family_relationships(patient_id);
CREATE INDEX idx_family_relationships_related_patient_id ON family_relationships(related_patient_id);
CREATE INDEX idx_patient_documents_patient_id ON patient_documents(patient_id);
CREATE INDEX idx_treatment_plans_patient_id ON treatment_plans(patient_id);

-- Create triggers for updating updated_at
CREATE TRIGGER update_family_relationships_updated_at
    BEFORE UPDATE ON family_relationships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_documents_updated_at
    BEFORE UPDATE ON patient_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatment_plans_updated_at
    BEFORE UPDATE ON treatment_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE family_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies for family_relationships
CREATE POLICY "Enable read access for related users" ON family_relationships
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id FROM patients WHERE id = family_relationships.patient_id
            UNION
            SELECT user_id FROM patients WHERE id = family_relationships.related_patient_id
        )
        OR auth.role() IN ('admin', 'staff')
    );

CREATE POLICY "Enable insert/update for staff and admin" ON family_relationships
    FOR ALL
    USING (auth.role() IN ('admin', 'staff'))
    WITH CHECK (auth.role() IN ('admin', 'staff'));

-- RLS policies for patient_documents
CREATE POLICY "Enable read access for document owners and staff" ON patient_documents
    FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM patients WHERE id = patient_documents.patient_id)
        OR auth.role() IN ('admin', 'staff')
    );

CREATE POLICY "Enable insert/update for staff and admin" ON patient_documents
    FOR ALL
    USING (auth.role() IN ('admin', 'staff'))
    WITH CHECK (auth.role() IN ('admin', 'staff'));

-- RLS policies for treatment_plans
CREATE POLICY "Enable read access for plan owners and staff" ON treatment_plans
    FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM patients WHERE id = treatment_plans.patient_id)
        OR auth.role() IN ('admin', 'staff')
    );

CREATE POLICY "Enable insert/update for staff and admin" ON treatment_plans
    FOR ALL
    USING (auth.role() IN ('admin', 'staff'))
    WITH CHECK (auth.role() IN ('admin', 'staff'));

-- Create storage bucket for patient documents
INSERT INTO storage.buckets (id, name, public) VALUES ('patient-documents', 'patient-documents', false);

-- Storage policy to allow authenticated users to upload files
CREATE POLICY "Enable upload access for authenticated users" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'patient-documents' AND
        (auth.role() IN ('admin', 'staff') OR auth.uid()::text = (storage.foldername(name))[1])
    );

-- Storage policy to allow users to read their own files
CREATE POLICY "Enable read access for file owners and staff" ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'patient-documents' AND
        (auth.role() IN ('admin', 'staff') OR auth.uid()::text = (storage.foldername(name))[1])
    );