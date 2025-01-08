# Database Schema Documentation

## Tables

### 1. family_relationships
- **Description**: Tracks family relationships between patients
- **Columns**:
  - `id` (UUID, Primary Key): Unique identifier
  - `patient_id` (UUID, Foreign Key): References patients(id)
  - `related_patient_id` (UUID, Foreign Key): References patients(id)
  - `relationship_type` (relationship_type): Type of relationship
  - `created_at` (Timestamp): Record creation time
  - `updated_at` (Timestamp): Last update time

### 2. patient_documents
- **Description**: Stores patient documents and files
- **Columns**:
  - `id` (UUID, Primary Key): Unique identifier
  - `patient_id` (UUID, Foreign Key): References patients(id)
  - `type` (document_type): Type of document
  - `file_path` (Text): Path to stored file
  - `description` (Text): Document description
  - `uploaded_by` (UUID, Foreign Key): References auth.users(id)
  - `created_at` (Timestamp): Record creation time
  - `updated_at` (Timestamp): Last update time

### 3. treatment_plans
- **Description**: Stores dental treatment plans
- **Columns**:
  - `id` (UUID, Primary Key): Unique identifier
  - `patient_id` (UUID, Foreign Key): References patients(id)
  - `title` (Varchar(255)): Plan title
  - `description` (Text): Plan description
  - `procedures` (JSONB): List of procedures
  - `estimated_cost` (Decimal(10,2)): Estimated cost
  - `duration` (Varchar(255)): Treatment duration
  - `status` (treatment_status): Current status
  - `created_by` (UUID, Foreign Key): References auth.users(id)
  - `created_at` (Timestamp): Record creation time
  - `updated_at` (Timestamp): Last update time

## Enums

### 1. relationship_type
- **Values**:
  - spouse
  - child
  - parent
  - sibling
  - other

### 2. document_type
- **Values**:
  - treatment_plan
  - x_ray
  - prescription
  - insurance
  - consent_form
  - other

### 3. treatment_status
- **Values**:
  - planned
  - in_progress
  - completed
  - cancelled

## Indexes

1. `idx_family_relationships_patient_id` (family_relationships.patient_id)
2. `idx_family_relationships_related_patient_id` (family_relationships.related_patient_id)
3. `idx_patient_documents_patient_id` (patient_documents.patient_id)
4. `idx_treatment_plans_patient_id` (treatment_plans.patient_id)

## Triggers

1. `update_family_relationships_updated_at`
   - Updates `updated_at` timestamp on family_relationships updates
2. `update_patient_documents_updated_at`
   - Updates `updated_at` timestamp on patient_documents updates
3. `update_treatment_plans_updated_at`
   - Updates `updated_at` timestamp on treatment_plans updates

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

1. **family_relationships**:
   - Read access for related users
   - Insert/update for staff and admin

2. **patient_documents**:
   - Read access for document owners and staff
   - Insert/update for staff and admin

3. **treatment_plans**:
   - Read access for plan owners and staff
   - Insert/update for staff and admin