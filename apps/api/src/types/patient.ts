import { Database } from "./database.types";

export type Patient = Database["public"]["Tables"]["patients"]["Row"];

export interface PatientInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  medicalHistory?: string;
}

export interface PatientSearchCriteria {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  email?: string;
}

export interface PatientDocument {
  id: string;
  patient_id: string;
  file_path: string;
  type: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TreatmentPlan {
  id: string;
  patient_id: string;
  title: string;
  description: string;
  procedures: Array<{
    code: string;
    name: string;
    cost: number;
    duration: string;
  }>;
  estimated_cost: number;
  duration: string;
  status: "pending" | "approved" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface PatientRelationship {
  id: string;
  patient_id: string;
  related_patient_id: string;
  relationship_type: string;
  created_at: string;
  updated_at: string;
  related_patient?: Patient;
}
