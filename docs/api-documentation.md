# API Documentation

## Patients API

### Base URL: `/api/patients`

### Endpoints

#### 1. Get Patient Profile

- **Method**: GET
- **URL**: `/:id`
- **Description**: Retrieve a patient's profile
- **Parameters**:
  - `id` (string): Patient ID
- **Response**:
  ```json
  {
    "id": "uuid",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone": "string",
    "date_of_birth": "string",
    "address": "string",
    "medical_history": "string"
  }
  ```

#### 2. Create Patient

- **Method**: POST
- **URL**: `/`
- **Description**: Create a new patient
- **Request Body**:
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone": "string",
    "date_of_birth": "string",
    "address": "string",
    "medical_history": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone": "string",
    "date_of_birth": "string",
    "address": "string",
    "medical_history": "string"
  }
  ```

#### 3. Update Patient

- **Method**: PUT
- **URL**: `/:id`
- **Description**: Update patient information
- **Parameters**:
  - `id` (string): Patient ID
- **Request Body**:
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone": "string",
    "date_of_birth": "string",
    "address": "string",
    "medical_history": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone": "string",
    "date_of_birth": "string",
    "address": "string",
    "medical_history": "string"
  }
  ```

#### 4. Delete Patient

- **Method**: DELETE
- **URL**: `/:id`
- **Description**: Delete a patient
- **Parameters**:
  - `id` (string): Patient ID
- **Response**: 204 No Content

#### 5. Get Family Members

- **Method**: GET
- **URL**: `/:id/family`
- **Description**: Get a patient's family members
- **Parameters**:
  - `id` (string): Patient ID
- **Response**:
  ```json
  [
    {
      "id": "uuid",
      "related_patient_id": "uuid",
      "relationship_type": "string"
    }
  ]
  ```

#### 6. Add Family Member

- **Method**: POST
- **URL**: `/:id/family`
- **Description**: Add a family member to a patient
- **Parameters**:
  - `id` (string): Patient ID
- **Request Body**:
  ```json
  {
    "related_patient_id": "string",
    "relationship_type": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "patient_id": "uuid",
    "related_patient_id": "uuid",
    "relationship_type": "string"
  }
  ```

#### 7. Upload Document

- **Method**: POST
- **URL**: `/:id/documents`
- **Description**: Upload a document for a patient
- **Parameters**:
  - `id` (string): Patient ID
- **Request Body**:
  ```json
  {
    "file": "File",
    "type": "string",
    "description": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "patient_id": "uuid",
    "type": "string",
    "file_path": "string",
    "description": "string"
  }
  ```

#### 8. Get Documents

- **Method**: GET
- **URL**: `/:id/documents`
- **Description**: Get a patient's documents
- **Parameters**:
  - `id` (string): Patient ID
- **Response**:
  ```json
  [
    {
      "id": "uuid",
      "patient_id": "uuid",
      "type": "string",
      "file_path": "string",
      "description": "string"
    }
  ]
  ```

#### 9. Update Medical History

- **Method**: PUT
- **URL**: `/:id/medical-history`
- **Description**: Update a patient's medical history
- **Parameters**:
  - `id` (string): Patient ID
- **Request Body**:
  ```json
  {
    "medical_history": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "medical_history": "string"
  }
  ```

#### 10. Create Treatment Plan

- **Method**: POST
- **URL**: `/:id/treatment-plans`
- **Description**: Create a treatment plan for a patient
- **Parameters**:
  - `id` (string): Patient ID
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "procedures": ["string"],
    "estimated_cost": "number",
    "duration": "number"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "patient_id": "uuid",
    "title": "string",
    "description": "string",
    "procedures": ["string"],
    "estimated_cost": "number",
    "duration": "number",
    "status": "string"
  }
  ```

#### 11. Get Treatment Plans

- **Method**: GET
- **URL**: `/:id/treatment-plans`
- **Description**: Get a patient's treatment plans
- **Parameters**:
  - `id` (string): Patient ID
- **Response**:
  ```json
  [
    {
      "id": "uuid",
      "patient_id": "uuid",
      "title": "string",
      "description": "string",
      "procedures": ["string"],
      "estimated_cost": "number",
      "duration": "number",
      "status": "string"
    }
  ]
  ```

## Type Definitions

All API endpoints are fully typed using TypeScript. The type definitions can be found in the `@dentalhub/types` package.

### Common Types

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

### Request/Response Types

```typescript
// Patient Types
interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
}

type CreatePatientRequest = Omit<Patient, "id" | "created_at" | "updated_at">;
type UpdatePatientRequest = Partial<CreatePatientRequest>;
type PatientResponse = ApiResponse<Patient>;
type PatientsListResponse = PaginatedResponse<Patient[]>;
```
