import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import axios, { AxiosInstance } from "axios";
import {
  SIKKA_API_URL,
  SIKKA_API_KEY,
  SIKKA_PRACTICE_ID,
} from "../integrations/sikka/config";
import { MonitoringService, logger } from "./monitoring";
import { ErrorCode, ServiceError } from "../types/errors";
import type { PatientSearchCriteria, Patient, PatientInput } from "../types/patient";

// Service interface for better dependency injection
export interface IPatientService {
  createPatient(input: PatientInput): Promise<{ data: Patient | null; error: ServiceError | null }>;
  getPatient(id: string): Promise<{ data: Patient | null; error: ServiceError | null }>;
  updatePatient(
    id: string,
    input: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      dateOfBirth?: string;
      address?: string;
      medicalHistory?: string;
    },
  ): Promise<{ data: Patient | null; error: ServiceError | null }>;
  deletePatient(id: string): Promise<{ error: ServiceError | null }>;
  getPatientFamilyMembers(patientId: string): Promise<{ data: any[]; error: ServiceError | null }>;
  addFamilyMember(
    patientId: string,
    input: { related_patient_id: string; relationship_type: string },
  ): Promise<{ data: any; error: ServiceError | null }>;
  uploadPatientDocument(
    patientId: string,
    file: File,
    type: string,
    description: string,
  ): Promise<{ data: any; error: ServiceError | null }>;
  searchPatients(criteria: PatientSearchCriteria): Promise<{ data: Patient[]; error: ServiceError | null }>;
  getPatientDocuments(patientId: string): Promise<{ data: any[]; error: ServiceError | null }>;
  updatePatientMedicalHistory(patientId: string, medicalHistory: string): Promise<{ data: Patient | null; error: ServiceError | null }>;
  createTreatmentPlan(
    patientId: string,
    input: {
      title: string;
      description: string;
      procedures: any[];
      estimated_cost: number;
      duration: string;
    },
  ): Promise<{ data: any; error: ServiceError | null }>;
  getPatientTreatmentPlans(patientId: string): Promise<{ data: any[]; error: ServiceError | null }>;
  syncPatientsFromSikka(): Promise<{ success: boolean; error: ServiceError | null }>;
}

export class PatientService implements IPatientService {
  protected readonly supabase: SupabaseClient<Database>;
  protected readonly sikkaApi: AxiosInstance;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
    this.sikkaApi = axios.create({
      baseURL: SIKKA_API_URL,
      headers: {
        "x-api-key": SIKKA_API_KEY,
      },
    });
  }

  async createPatient(input: PatientInput): Promise<{ data: Patient | null; error: ServiceError | null }> {
    try {
      const { data, error } = await this.supabase
        .from("patients")
        .insert({
          first_name: input.firstName,
          last_name: input.lastName,
          email: input.email,
          phone: input.phone,
          date_of_birth: input.dateOfBirth,
          address: input.address,
          medical_history: input.medicalHistory,
        })
        .select()
        .single();

      if (error) {
        throw new ServiceError(ErrorCode.DatabaseError, "Failed to create patient", error);
      }

      return { data, error: null };
    } catch (err) {
      logger.error("Error creating patient:", err);
      return { 
        data: null, 
        error: err instanceof ServiceError ? err : new ServiceError(ErrorCode.UnknownError, "Unknown error occurred")
      };
    }
  }

  async getPatient(id: string): Promise<{ data: Patient | null; error: ServiceError | null }> {
    try {
      const { data, error } = await this.supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new ServiceError(ErrorCode.DatabaseError, "Failed to get patient", error);
      }

      return { data, error: null };
    } catch (err) {
      logger.error("Error getting patient:", err);
      return { 
        data: null, 
        error: err instanceof ServiceError ? err : new ServiceError(ErrorCode.UnknownError, "Unknown error occurred")
      };
    }
  }

  async updatePatient(
    id: string,
    input: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      dateOfBirth?: string;
      address?: string;
      medicalHistory?: string;
    },
  ): Promise<{ data: Patient | null; error: ServiceError | null }> {
    try {
      const { data, error } = await this.supabase
        .from("patients")
        .update({
          first_name: input.firstName,
          last_name: input.lastName,
          email: input.email,
          phone: input.phone,
          date_of_birth: input.dateOfBirth,
          address: input.address,
          medical_history: input.medicalHistory,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new ServiceError(ErrorCode.DatabaseError, "Failed to update patient", error);
      }

      return { data, error: null };
    } catch (err) {
      logger.error("Error updating patient:", err);
      return { 
        data: null, 
        error: err instanceof ServiceError ? err : new ServiceError(ErrorCode.UnknownError, "Unknown error occurred")
      };
    }
  }

  async deletePatient(id: string): Promise<{ error: ServiceError | null }> {
    try {
      const { error } = await this.supabase
        .from("patients")
        .delete()
        .eq("id", id);

      if (error) {
        throw new ServiceError(ErrorCode.DatabaseError, "Failed to delete patient", error);
      }

      return { error: null };
    } catch (err) {
      logger.error("Error deleting patient:", err);
      return { 
        error: err instanceof ServiceError ? err : new ServiceError(ErrorCode.UnknownError, "Unknown error occurred")
      };
    }
  }

  async getPatientFamilyMembers(patientId: string): Promise<{ data: any[]; error: ServiceError | null }> {
    try {
      const { data, error } = await this.supabase
        .from("patient_relationships")
        .select(
          `
          *,
          related_patient:patients(*)
        `,
        )
        .eq("patient_id", patientId);

      if (error) {
        throw new ServiceError(ErrorCode.DatabaseError, "Failed to get patient family members", error);
      }

      return { data, error: null };
    } catch (err) {
      logger.error("Error getting patient family members:", err);
      return { 
        data: null, 
        error: err instanceof ServiceError ? err : new ServiceError(ErrorCode.UnknownError, "Unknown error occurred")
      };
    }
  }

  async addFamilyMember(
    patientId: string,
    input: { related_patient_id: string; relationship_type: string },
  ): Promise<{ data: any; error: ServiceError | null }> {
    try {
      const { data, error } = await this.supabase
        .from("patient_relationships")
        .insert({
          patient_id: patientId,
          related_patient_id: input.related_patient_id,
          relationship_type: input.relationship_type,
        })
        .select()
        .single();

      if (error) {
        throw new ServiceError(ErrorCode.DatabaseError, "Failed to add family member", error);
      }

      return { data, error: null };
    } catch (err) {
      logger.error("Error adding family member:", err);
      return { 
        data: null, 
        error: err instanceof ServiceError ? err : new ServiceError(ErrorCode.UnknownError, "Unknown error occurred")
      };
    }
  }

  async uploadPatientDocument(
    patientId: string,
    file: File,
    type: string,
    description: string,
  ): Promise<{ data: any; error: ServiceError | null }> {
    try {
      // Upload file to storage
      const { data: fileData, error: fileError } = await this.supabase.storage
        .from("patient-documents")
        .upload(`${patientId}/${file.name}`, file);

      if (fileError) {
        throw new ServiceError(ErrorCode.StorageError, "Failed to upload patient document", fileError);
      }

      // Create document record
      const { data, error } = await this.supabase
        .from("patient_documents")
        .insert({
          patient_id: patientId,
          file_path: fileData.path,
          type,
          description,
        })
        .select()
        .single();

      if (error) {
        throw new ServiceError(ErrorCode.DatabaseError, "Failed to create patient document record", error);
      }

      return { data, error: null };
    } catch (err) {
      logger.error("Error uploading patient document:", err);
      return { 
        data: null, 
        error: err instanceof ServiceError ? err : new ServiceError(ErrorCode.UnknownError, "Unknown error occurred")
      };
    }
  }

  async searchPatients(criteria: PatientSearchCriteria): Promise<{ data: Patient[]; error: ServiceError | null }> {
    try {
      let query = this.supabase.from("patients").select("*").limit(100);

      if (criteria.firstName) {
        query = query.ilike("first_name", `%${criteria.firstName}%`);
      }

      if (criteria.lastName) {
        query = query.ilike("last_name", `%${criteria.lastName}%`);
      }

      if (criteria.dateOfBirth) {
        query = query.eq("date_of_birth", criteria.dateOfBirth);
      }

      if (criteria.phoneNumber) {
        query = query.ilike("phone", `%${criteria.phoneNumber}%`);
      }

      if (criteria.email) {
        query = query.ilike("email", `%${criteria.email}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw new ServiceError(ErrorCode.DatabaseError, "Failed to search patients", error);
      }

      return { data, error: null };
    } catch (err) {
      logger.error("Error searching patients:", err);
      return { 
        data: null, 
        error: err instanceof ServiceError ? err : new ServiceError(ErrorCode.UnknownError, "Unknown error occurred")
      };
    }
  }

  async getPatientDocuments(patientId: string): Promise<{ data: any[]; error: ServiceError | null }> {
    try {
      const { data, error } = await this.supabase
        .from("patient_documents")
        .select("*")
        .eq("patient_id", patientId);

      if (error) {
        throw new ServiceError(ErrorCode.DatabaseError, "Failed to get patient documents", error);
      }

      return { data, error: null };
    } catch (err) {
      logger.error("Error getting patient documents:", err);
      return { 
        data: null, 
        error: err instanceof ServiceError ? err : new ServiceError(ErrorCode.UnknownError, "Unknown error occurred")
      };
    }
  }

  async updatePatientMedicalHistory(patientId: string, medicalHistory: string): Promise<{ data: Patient | null; error: ServiceError | null }> {
    try {
      const { data, error } = await this.supabase
        .from("patients")
        .update({ medical_history: medicalHistory })
        .eq("id", patientId)
        .select()
        .single();

      if (error) {
        throw new ServiceError(ErrorCode.DatabaseError, "Failed to update patient medical history", error);
      }

      return { data, error: null };
    } catch (err) {
      logger.error("Error updating patient medical history:", err);
      return { 
        data: null, 
        error: err instanceof ServiceError ? err : new ServiceError(ErrorCode.UnknownError, "Unknown error occurred")
      };
    }
  }

  async createTreatmentPlan(
    patientId: string,
    input: {
      title: string;
      description: string;
      procedures: any[];
      estimated_cost: number;
      duration: string;
    },
  ): Promise<{ data: any; error: ServiceError | null }> {
    try {
      const { data, error } = await this.supabase
        .from("treatment_plans")
        .insert({
          patient_id: patientId,
          title: input.title,
          description: input.description,
          procedures: input.procedures,
          estimated_cost: input.estimated_cost,
          duration: input.duration,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        throw new ServiceError(ErrorCode.DatabaseError, "Failed to create treatment plan", error);
      }

      return { data, error: null };
    } catch (err) {
      logger.error("Error creating treatment plan:", err);
      return { 
        data: null, 
        error: err instanceof ServiceError ? err : new ServiceError(ErrorCode.UnknownError, "Unknown error occurred")
      };
    }
  }

  async getPatientTreatmentPlans(patientId: string): Promise<{ data: any[]; error: ServiceError | null }> {
    try {
      const { data, error } = await this.supabase
        .from("treatment_plans")
        .select("*")
        .eq("patient_id", patientId);

      if (error) {
        throw new ServiceError(ErrorCode.DatabaseError, "Failed to get patient treatment plans", error);
      }

      return { data, error: null };
    } catch (err) {
      logger.error("Error getting patient treatment plans:", err);
      return { 
        data: null, 
        error: err instanceof ServiceError ? err : new ServiceError(ErrorCode.UnknownError, "Unknown error occurred")
      };
    }
  }

  async syncPatientsFromSikka(): Promise<{ success: boolean; error: ServiceError | null }> {
    try {
      const response = await this.sikkaApi.get(
        `/practices/${SIKKA_PRACTICE_ID}/patients`,
      );
      const sikkaPatients = response.data;

      if (!sikkaPatients || !Array.isArray(sikkaPatients)) {
        await MonitoringService.logError(
          new Error("Invalid Sikka patient data"),
          ErrorCode.VALIDATION_ERROR,
          { sikkaPatients },
        );
        return { success: false, error: new ServiceError(ErrorCode.VALIDATION_ERROR, "Invalid Sikka patient data") };
      }

      let updatedCount = 0;
      let createdCount = 0;

      for (const sikkaPatient of sikkaPatients) {
        const { data: existingPatient } = await this.supabase
          .from("patients")
          .select("id")
          .eq("id", sikkaPatient.patient_id)
          .single();

        if (existingPatient) {
          // Update existing patient
          await this.updatePatient(existingPatient.id, {
            firstName: sikkaPatient.first_name,
            lastName: sikkaPatient.last_name,
            email: sikkaPatient.email,
            phone: sikkaPatient.phone,
            dateOfBirth: sikkaPatient.date_of_birth,
            address: sikkaPatient.address,
          });
          updatedCount++;
        } else {
          // Create new patient
          await this.createPatient({
            firstName: sikkaPatient.first_name,
            lastName: sikkaPatient.last_name,
            email: sikkaPatient.email,
            phone: sikkaPatient.phone,
            dateOfBirth: sikkaPatient.date_of_birth,
            address: sikkaPatient.address,
          });
          createdCount++;
        }
      }

      logger.info(
        `Synced patients from Sikka: ${createdCount} created, ${updatedCount} updated`,
      );
      return { success: true, error: null };
    } catch (error) {
      await MonitoringService.logError(
        error as Error,
        ErrorCode.EXTERNAL_API_ERROR,
        { service: "Sikka" },
      );
      return { success: false, error: new ServiceError(ErrorCode.EXTERNAL_API_ERROR, "Failed to sync patients from Sikka") };
    }
  }

  // Type guard for Sikka API response
  private isSikkaPatientResponse(response: unknown): response is { patient_id: string; status: string } {
    return (
      typeof response === "object" &&
      response !== null &&
      "patient_id" in response &&
      "status" in response &&
      typeof response.patient_id === "string" &&
      typeof response.status === "string"
    );
  }
}
