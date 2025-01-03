import { Patient, PatientFilters, PatientCreateInput, PatientUpdateInput } from './types';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@dentalhub/database';

export class PatientService {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
  }

  async createPatient(input: PatientCreateInput): Promise<Patient> {
    const { data, error } = await this.supabase
      .from('patients')
      .insert(input)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async getPatient(id: string): Promise<Patient | null> {
    const { data, error } = await this.supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async listPatients(filters?: PatientFilters): Promise<Patient[]> {
    let query = this.supabase
      .from('patients')
      .select('*')

    if (filters) {
      for (const key in filters) {
        if (filters[key]) {
          query = query.ilike(key, `%${filters[key]}%`);
        }
      }
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  }

  async updatePatient(id: string, input: PatientUpdateInput): Promise<Patient | null> {
    const { data, error } = await this.supabase
      .from('patients')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deletePatient(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('patients')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
}

export const createPatientService = (supabase: SupabaseClient<Database>): PatientService => {
  return new PatientService(supabase);
};