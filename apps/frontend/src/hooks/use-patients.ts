import { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabase';
import type { Patient } from '../types';
import type { PostgrestError } from '@supabase/supabase-js';

type Appointment = {
  start_time: string;
  status: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type PatientWithAppointments = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  balance: number;
  date_of_birth: string;
  address: string;
  medical_history: string;
  appointments: Appointment[];
};

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  nextAppointment?: string;
  status: string;
  balance: number;
		lastVisit?: string;
}

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabaseService
        .from('patients')
        .select<PatientWithAppointments, PatientWithAppointments>(`
          id,
          first_name,
          last_name,
          email,
          phone,
          status,
          balance,
          date_of_birth,
          address,
          medical_history,
          appointments (
            start_time,
            status
          )
        `)
        .order('last_name', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
						}

      const formattedPatients: Patient[] = data.map((patient) => ({
        id: patient.id,
        name: `${patient.first_name} ${patient.last_name}`,
        email: patient.email || '',
        phone: patient.phone || '',
        nextAppointment: patient.appointments?.find(a => a.status === 'scheduled')?.start_time,
        status: patient.status || 'active',
        balance: patient.balance || 0,
        lastVisit: patient.appointments?.sort((a: any, b: any) =>
          new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
        )?.[0]?.start_time
						}));

      setPatients(formattedPatients);
    } catch (err) {
      setError(err as PostgrestError);
    } finally {
      setLoading(false);
    }
		};

  useEffect(() => {
    fetchPatients();
		}, []);

  const addPatient = async (patientData: Omit<Patient, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabaseService
        .from('patients')
        .insert([{
          first_name: patientData.name.split(' ')[0],
          last_name: patientData.name.split(' ').slice(1).join(' '),
          email: patientData.email,
          phone: patientData.phone,
          status: patientData.status,
          balance: patientData.balance
        }])
        .select()
								.single() as { data: PatientWithAppointments, error: any };

      if (supabaseError) {
        throw supabaseError;
						}

      await fetchPatients();
      return data;
    } catch (err) {
      setError(err as PostgrestError);
      console.error('Error adding patient:', err);
      throw err;
    } finally {
      setLoading(false);
    }
		};

  const updatePatient = async (id: string, patientData: Partial<Patient>) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabaseService
        .from('patients')
        .update({
          first_name: patientData.name?.split(' ')[0],
          last_name: patientData.name?.split(' ').slice(1).join(' '),
          email: patientData.email,
          phone: patientData.phone,
          status: patientData.status,
          balance: patientData.balance
        })
        .eq('id', id)
        .select()
								.single() as { data: PatientWithAppointments, error: any };

      if (supabaseError) {
        throw supabaseError;
						}

      await fetchPatients();
      return data;
    } catch (err) {
      setError(err as PostgrestError);
      console.error('Error updating patient:', err);
      throw err;
    } finally {
      setLoading(false);
    }
		};

  const deletePatient = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: supabaseError } = await supabaseService
        .from('patients')
        .delete()
								.eq('id', id);

      if (supabaseError) {
        throw supabaseError;
						}

      await fetchPatients();
    } catch (err) {
      setError(err as PostgrestError);
      console.error('Error deleting patient:', err);
      throw err;
    } finally {
      setLoading(false);
    }
		};

  return {
    patients,
    loading,
    error,
    fetchPatients,
    addPatient,
    updatePatient,
    deletePatient
		};
};