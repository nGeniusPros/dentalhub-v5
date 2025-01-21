import axios from 'axios';
import { SIKKA_API_URL, SIKKA_API_KEY, SIKKA_PRACTICE_ID } from '../integrations/sikka/config';
export class PatientService {
    constructor(supabase) {
        this.sikkaApi = axios.create({
            baseURL: SIKKA_API_URL,
            headers: {
                'x-api-key': SIKKA_API_KEY,
            },
        });
        this.supabase = supabase;
    }
    async createPatient(input) {
        const { data, error } = await this.supabase
            .from('patients')
            .insert({
            first_name: input.firstName,
            last_name: input.lastName,
            email: input.email,
            phone: input.phone,
            date_of_birth: input.dateOfBirth,
            address: input.address,
            medical_history: input.medicalHistory
        })
            .select()
            .single();
        return { data, error };
    }
    async getPatient(id) {
        const { data, error } = await this.supabase
            .from('patients')
            .select('*')
            .eq('id', id)
            .single();
        return { data, error };
    }
    async updatePatient(id, input) {
        const { data, error } = await this.supabase
            .from('patients')
            .update({
            first_name: input.firstName,
            last_name: input.lastName,
            email: input.email,
            phone: input.phone,
            date_of_birth: input.dateOfBirth,
            address: input.address,
            medical_history: input.medicalHistory
        })
            .eq('id', id)
            .select()
            .single();
        return { data, error };
    }
    async deletePatient(id) {
        const { error } = await this.supabase
            .from('patients')
            .delete()
            .eq('id', id);
        return { error };
    }
    async getPatientFamilyMembers(patientId) {
        const { data, error } = await this.supabase
            .from('patient_relationships')
            .select(`
        *,
        related_patient:patients(*)
      `)
            .eq('patient_id', patientId);
        return { data, error };
    }
    async addFamilyMember(patientId, input) {
        const { data, error } = await this.supabase
            .from('patient_relationships')
            .insert({
            patient_id: patientId,
            related_patient_id: input.related_patient_id,
            relationship_type: input.relationship_type
        })
            .select()
            .single();
        return { data, error };
    }
    async uploadPatientDocument(patientId, file, type, description) {
        // Upload file to storage
        const { data: fileData, error: fileError } = await this.supabase
            .storage
            .from('patient-documents')
            .upload(`${patientId}/${file.name}`, file);
        if (fileError) {
            return { error: fileError };
        }
        // Create document record
        const { data, error } = await this.supabase
            .from('patient_documents')
            .insert({
            patient_id: patientId,
            file_path: fileData.path,
            type,
            description
        })
            .select()
            .single();
        return { data, error };
    }
    async getPatientDocuments(patientId) {
        const { data, error } = await this.supabase
            .from('patient_documents')
            .select('*')
            .eq('patient_id', patientId);
        return { data, error };
    }
    async updatePatientMedicalHistory(patientId, medicalHistory) {
        const { data, error } = await this.supabase
            .from('patients')
            .update({ medical_history: medicalHistory })
            .eq('id', patientId)
            .select()
            .single();
        return { data, error };
    }
    async createTreatmentPlan(patientId, input) {
        const { data, error } = await this.supabase
            .from('treatment_plans')
            .insert({
            patient_id: patientId,
            title: input.title,
            description: input.description,
            procedures: input.procedures,
            estimated_cost: input.estimated_cost,
            duration: input.duration,
            status: 'pending'
        })
            .select()
            .single();
        return { data, error };
    }
    async getPatientTreatmentPlans(patientId) {
        const { data, error } = await this.supabase
            .from('treatment_plans')
            .select('*')
            .eq('patient_id', patientId);
        return { data, error };
    }
    async syncPatientsFromSikka() {
        try {
            const response = await this.sikkaApi.get(`/practices/${SIKKA_PRACTICE_ID}/patients`);
            const sikkaPatients = response.data;
            if (!sikkaPatients || !Array.isArray(sikkaPatients)) {
                console.error('Invalid Sikka patient data:', sikkaPatients);
                return;
            }
            for (const sikkaPatient of sikkaPatients) {
                const { data: existingPatient } = await this.supabase
                    .from('patients')
                    .select('id')
                    .eq('id', sikkaPatient.patient_id)
                    .single();
                if (existingPatient) {
                    // Update existing patient
                    await this.supabase
                        .from('patients')
                        .update({
                        first_name: sikkaPatient.first_name,
                        last_name: sikkaPatient.last_name,
                        email: sikkaPatient.email,
                        phone: sikkaPatient.phone,
                        date_of_birth: sikkaPatient.date_of_birth,
                        address: sikkaPatient.address,
                        medical_history: sikkaPatient.medical_history
                    })
                        .eq('id', sikkaPatient.patient_id);
                }
                else {
                    // Insert new patient
                    await this.supabase
                        .from('patients')
                        .insert({
                        id: sikkaPatient.patient_id,
                        first_name: sikkaPatient.first_name,
                        last_name: sikkaPatient.last_name,
                        email: sikkaPatient.email,
                        phone: sikkaPatient.phone,
                        date_of_birth: sikkaPatient.date_of_birth,
                        address: sikkaPatient.address,
                        medical_history: sikkaPatient.medical_history
                    });
                }
            }
            console.log('Successfully synced patients from Sikka');
        }
        catch (error) {
            console.error('Error syncing patients from Sikka:', error);
        }
    }
}
