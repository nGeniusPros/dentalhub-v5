import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import axios from "axios";
import {
  SIKKA_API_URL,
  SIKKA_API_KEY,
  SIKKA_PRACTICE_ID,
} from "../integrations/sikka/config";
import { MonitoringService, logger } from "./monitoring";
import { ErrorCode } from "../types/errors";
import type { PatientSearchCriteria } from "../types/patient";

export class PatientService {
  protected supabase: SupabaseClient<Database>;
  protected sikkaApi = axios.create({
    baseURL: SIKKA_API_URL,
    headers: {
      "x-api-key": SIKKA_API_KEY,
    },
  });

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
  }

  async createPatient(input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    medicalHistory?: string;
  }) {
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

    return { data, error };
  }

  async getPatient(id: string) {
    const { data, error } = await this.supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    return { data, error };
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
  ) {
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

    return { data, error };
  }

  async deletePatient(id: string) {
    const { error } = await this.supabase
      .from("patients")
      .delete()
      .eq("id", id);

    return { error };
  }

  async getPatientFamilyMembers(patientId: string) {
    const { data, error } = await this.supabase
      .from("patient_relationships")
      .select(
        `
        *,
        related_patient:patients(*)
      `,
      )
      .eq("patient_id", patientId);

    return { data, error };
  }

  async addFamilyMember(
    patientId: string,
    input: { related_patient_id: string; relationship_type: string },
  ) {
    const { data, error } = await this.supabase
      .from("patient_relationships")
      .insert({
        patient_id: patientId,
        related_patient_id: input.related_patient_id,
        relationship_type: input.relationship_type,
      })
      .select()
      .single();

    return { data, error };
  }

  async uploadPatientDocument(
    patientId: string,
    file: File,
    type: string,
    description: string,
  ) {
    // Upload file to storage
    const { data: fileData, error: fileError } = await this.supabase.storage
      .from("patient-documents")
      .upload(`${patientId}/${file.name}`, file);

    if (fileError) {
      return { error: fileError };
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

    return { data, error };
  }

  async searchPatients(criteria: PatientSearchCriteria) {
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
      throw new Error(`Supabase query error: ${error.message}`);
    }

    return data;
  }

  async getPatientDocuments(patientId: string) {
    const { data, error } = await this.supabase
      .from("patient_documents")
      .select("*")
      .eq("patient_id", patientId);

    return { data, error };
  }

  async updatePatientMedicalHistory(patientId: string, medicalHistory: string) {
    const { data, error } = await this.supabase
      .from("patients")
      .update({ medical_history: medicalHistory })
      .eq("id", patientId)
      .select()
      .single();

    return { data, error };
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
  ) {
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

    return { data, error };
  }

  async getPatientTreatmentPlans(patientId: string) {
    const { data, error } = await this.supabase
      .from("treatment_plans")
      .select("*")
      .eq("patient_id", patientId);

    return { data, error };
  }

  async syncPatientsFromSikka() {
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
        return;
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
    } catch (error) {
      await MonitoringService.logError(
        error as Error,
        ErrorCode.EXTERNAL_API_ERROR,
        { service: "Sikka" },
      );
      throw error;
    }
  }
}
