import { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import type { DatabasePatient, DatabaseAppointment } from '@dentalhub/types/database';

export interface Patient {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  nextAppointment?: string;
  status: 'active' | 'inactive' | 'pending';
  balance: number;
  lastVisit?: string;
}

interface PatientWithAppointments extends DatabasePatient {
  appointments: DatabaseAppointment[];
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
        .select<'*', PatientWithAppointments>(`
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
            id,
            start_time,
            end_time,
            status,
            type,
            notes
          )
        `)
        .order('last_name', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      const formattedPatients: Patient[] = (data || []).map((patient) => ({
        id: patient.id,
        name: `${patient.first_name} ${patient.last_name}`,
        email: patient.email,
        phone: patient.phone,
        nextAppointment: patient.appointments
          ?.find(a => a.status === 'scheduled')
          ?.start_time,
        status: patient.status,
        balance: patient.balance,
        lastVisit: patient.appointments
          ?.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
          ?.[0]?.start_time
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

  const addPatient = async (patientData: Omit<Patient, 'id' | 'nextAppointment' | 'lastVisit'>) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabaseService
        .from('patients')
        .insert<DatabasePatient>([{
          first_name: patientData.name.split(' ')[0],
          last_name: patientData.name.split(' ').slice(1).join(' '),
          email: patientData.email,
          phone: patientData.phone,
          status: patientData.status,
          balance: patientData.balance,
          date_of_birth: null,
          address: null,
          medical_history: null
        }])
        .select()
        .single();

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

  const updatePatient = async (id: string, patientData: Partial<Omit<Patient, 'id' | 'nextAppointment' | 'lastVisit'>>) => {
    setLoading(true);
    setError(null);
    try {
      const updateData: Partial<DatabasePatient> = {
        ...(patientData.name && {
          first_name: patientData.name.split(' ')[0],
          last_name: patientData.name.split(' ').slice(1).join(' ')
        }),
        ...(patientData.email !== undefined && { email: patientData.email }),
        ...(patientData.phone !== undefined && { phone: patientData.phone }),
        ...(patientData.status && { status: patientData.status }),
        ...(patientData.balance !== undefined && { balance: patientData.balance })
      };

      const { data, error: supabaseError } = await supabaseService
        .from('patients')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

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