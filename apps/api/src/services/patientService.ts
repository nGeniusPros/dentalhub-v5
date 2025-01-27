import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import axios from "axios";
import { SIKKA_API_URL } from "../config";
import { ServiceError, ErrorCode } from "../types/errors";
import { MonitoringService } from "./monitoringService";

interface SikkaStartResponse {
  scope: string;
  request_key: string;
  token_type: string;
  expires_in: string;
}

interface SikkaPatient {
  href: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface SikkaResponse<T> {
  offset: string;
  limit: string;
  total_count: string;
  items: T[];
}

interface IPatientService {
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
  private supabase: SupabaseClient<Database>;
  private token: string | null = null;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
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
      console.error("Error creating patient:", err);
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
      console.error("Error getting patient:", err);
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
      console.error("Error updating patient:", err);
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
      console.error("Error deleting patient:", err);
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
      console.error("Error getting patient family members:", err);
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
      console.error("Error adding family member:", err);
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
      console.error("Error uploading patient document:", err);
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
      console.error("Error searching patients:", err);
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
      console.error("Error getting patient documents:", err);
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
      console.error("Error updating patient medical history:", err);
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
      console.error("Error creating treatment plan:", err);
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
      console.error("Error getting patient treatment plans:", err);
      return { 
        data: null, 
        error: err instanceof ServiceError ? err : new ServiceError(ErrorCode.UnknownError, "Unknown error occurred")
      };
    }
  }

  private async getAuthorizedPractices() {
    try {
      // First get list of all authorized practices
      const listResponse = await axios.get(`${SIKKA_API_URL}/authorized_practices`, {
        headers: {
          'app-id': process.env.SIKKA_APP_ID,
          'app-key': process.env.SIKKA_APP_KEY,
          'Content-Type': 'application/json'
        }
      });

      console.log('Authorized practices list:', listResponse.data);

      // Handle both array and object responses
      const practicesList = Array.isArray(listResponse.data) ? listResponse.data : [listResponse.data];
      const practiceId = `D${process.env.SIKKA_PRACTICE_ID}`;
      const practice = practicesList.find((p: any) => p.office_id === practiceId);
      
      if (!practice) {
        throw new Error(`Practice ID ${practiceId} not found in authorized practices list`);
      }

      // Get detailed practice info
      const response = await axios.get(`${SIKKA_API_URL}/authorized_practices/${practiceId}`, {
        headers: {
          'app-id': process.env.SIKKA_APP_ID,
          'app-key': process.env.SIKKA_APP_KEY,
          'Content-Type': 'application/json'
        }
      });

      console.log('Practice details response:', response.data);

      // Handle both array and object responses
      const practiceDetails = Array.isArray(response.data) ? response.data[0] : response.data;
      if (!practiceDetails) {
        throw new Error(`Could not get details for practice ID ${practiceId}`);
      }

      return practiceDetails;
    } catch (error) {
      console.error('Error getting authorized practices:', error);
      throw error;
    }
  }

  private async getSikkaRequestKey(): Promise<string> {
    try {
      // Get request key
      const response = await axios.post(
        `${SIKKA_API_URL}/request_key`,
        {
          grant_type: "request_key",
          office_id: process.env.SIKKA_PRACTICE_ID,
          secret_key: process.env.SIKKA_P1_PRACTICE_KEY,
          app_id: process.env.SIKKA_APP_ID,
          app_key: process.env.SIKKA_APP_KEY
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Request key response:', response.data);

      if (!response.data?.request_key) {
        throw new Error('Invalid response from Sikka API: missing request_key');
      }

      return response.data.request_key;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Sikka API error:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        throw new Error(`Sikka API error: ${error.response?.data?.long_message || error.message}`);
      }
      throw error;
    }
  }

  private async endSikkaSession(token: string): Promise<void> {
    try {
      await axios.post(`${SIKKA_API_URL}/auth/logout`, {
        token
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Sikka session ended');
    } catch (error) {
      console.error('Error ending Sikka session:', error);
    }
  }

  async syncPatientsFromSikka(): Promise<{ success: boolean; error: ServiceError | null }> {
    let requestKey: string | null = null;
    try {
      console.log('Starting Sikka patient sync...');
      console.log('Environment variables:', {
        SIKKA_APP_ID: process.env.SIKKA_APP_ID,
        SIKKA_PRACTICE_ID: process.env.SIKKA_PRACTICE_ID
      });

      if (!process.env.SIKKA_APP_ID || !process.env.SIKKA_APP_KEY || 
          !process.env.SIKKA_PRACTICE_ID || !process.env.SIKKA_P1_PRACTICE_KEY) {
        throw new Error('Missing required Sikka API environment variables');
      }

      console.log('Getting Sikka request key...');
      requestKey = await this.getSikkaRequestKey();
      console.log('Got request key:', requestKey);

      const response = await axios.get<SikkaResponse<SikkaPatient>[]>(
        `${SIKKA_API_URL}/patients?practice_id=${process.env.SIKKA_PRACTICE_ID}`,
        {
          headers: {
            'request-key': requestKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      ).catch(error => {
        if (axios.isAxiosError(error)) {
          console.error('Sikka API error:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
            config: error.config
          });
          throw new Error(`Sikka API error: ${error.response?.data?.long_message || error.message}`);
        }
        throw error;
      });

      console.log('Sikka API response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      if (!response.data?.[0]?.items) {
        throw new Error('Invalid response from Sikka API: missing items array');
      }

      const sikkaPatients = response.data[0].items;
      console.log(`Found ${sikkaPatients.length} patients from Sikka`);

      // Process patients...
      for (const patient of sikkaPatients) {
        const { data: existingPatient } = await this.supabase
          .from("patients")
          .select("id")
          .eq("id", patient.patient_id)
          .single();

        const patientData = {
          id: patient.patient_id,
          firstName: patient.first_name,
          lastName: patient.last_name,
          email: patient.email,
          phone: patient.phone,
          dateOfBirth: patient.date_of_birth,
          address: patient.address,
          city: patient.city,
          state: patient.state,
          zipCode: patient.zip,
          lastSyncedAt: new Date().toISOString()
        };

        if (existingPatient) {
          await this.supabase
            .from("patients")
            .update(patientData)
            .eq("id", patient.patient_id);
        } else {
          await this.supabase
            .from("patients")
            .insert(patientData);
        }
      }

      return { success: true, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error syncing patients from Sikka:', message);
      await MonitoringService.logError(
        error instanceof Error ? error : new Error(message),
        ErrorCode.EXTERNAL_API_ERROR,
        { service: "Sikka" }
      );
      return {
        success: false,
        error: new ServiceError(
          ErrorCode.EXTERNAL_API_ERROR,
          `Failed to sync patients from Sikka: ${message}`
        )
      };
    } finally {
      if (requestKey) {
        await this.endSikkaSession(requestKey);
      }
    }
  }
}
