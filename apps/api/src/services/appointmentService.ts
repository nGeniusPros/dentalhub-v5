import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types.js';

interface AppointmentResource {
  id: string;
  type: string;
}

interface AppointmentReminder {
  type: string;
  scheduled_time: string;
}

interface AppointmentData {
  patient_id: string;
  provider_id: string;
  type: string;
  start_time: string;
  end_time: string;
  duration: number;
  notes?: string;
  resources?: AppointmentResource[];
  reminders?: AppointmentReminder[];
  status?: string;
}

export class AppointmentService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getAllAppointments(options: {
    startDate?: string;
    endDate?: string;
    status?: string;
    providerId?: string;
    patientId?: string;
  }) {
    let query = this.supabase
      .from('appointments')
      .select(`
        *,
        patient:patients!inner(id, first_name, last_name, email, phone),
        provider:users!provider_id(id, email, raw_user_meta_data),
        resources:appointment_resources(
          id,
          resource:resources(id, name, type)
        ),
        comments:appointment_comments(
          id,
          content,
          created_at,
          user:users(id, email, raw_user_meta_data)
        )
      `);

    const { startDate, endDate, status, providerId, patientId } = options;

    if (startDate) {
      query = query.gte('start_time', startDate);
    }
    if (endDate) {
      query = query.lte('end_time', endDate);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (providerId) {
      query = query.eq('provider_id', providerId);
    }
    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    return await query.order('start_time', { ascending: true });
  }

  async getAppointmentById(id: string) {
    return await this.supabase
      .from('appointments')
      .select(`
        *,
        patient:patients!inner(id, first_name, last_name, email, phone),
        provider:users!provider_id(id, email, raw_user_meta_data),
        resources:appointment_resources(
          id,
          resource:resources(id, name, type)
        ),
        comments:appointment_comments(
          id,
          content,
          created_at,
          user:users(id, email, raw_user_meta_data)
        ),
        reminders:appointment_reminders(*)
      `)
      .eq('id', id)
      .single();
  }

  async createAppointment(data: AppointmentData, userId: string | undefined) {
    const { resources, reminders, ...appointmentData } = data;
    const { data: appointment, error: appointmentError } = await this.supabase
      .from('appointments')
      .insert({
        ...appointmentData,
        created_by: userId,
        status: 'scheduled'
      })
      .select()
      .single();

    if (appointmentError) {
      throw appointmentError;
    }

    // Add resources
    if (resources && resources.length > 0) {
      const { error: resourceError } = await this.supabase
        .from('appointment_resources')
        .insert(
          resources.map((resource) => ({
            appointment_id: appointment.id,
            resource_id: resource.id,
            resource_type: resource.type
          }))
        );

      if (resourceError) {
        throw resourceError;
      }
    }

    // Schedule reminders
    if (reminders && reminders.length > 0) {
      const { error: reminderError } = await this.supabase
        .from('appointment_reminders')
        .insert(
          reminders.map((reminder) => ({
            appointment_id: appointment.id,
            type: reminder.type,
            scheduled_time: reminder.scheduled_time
          }))
        );

      if (reminderError) {
        throw reminderError;
      }
    }

    return this.getAppointmentById(appointment.id);
  }

  async updateAppointment(id: string, data: Partial<AppointmentData>) {
    const { resources, reminders, ...appointmentData } = data;
    const { data: appointment, error: appointmentError } = await this.supabase
      .from('appointments')
      .update({
        ...appointmentData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (appointmentError) {
      throw appointmentError;
    }

    // Update resources
    if (resources !== undefined) {
      await this.supabase
        .from('appointment_resources')
        .delete()
        .eq('appointment_id', id);

      if (resources.length > 0) {
        const { error: resourceError } = await this.supabase
          .from('appointment_resources')
          .insert(
            resources.map((resource) => ({
              appointment_id: id,
              resource_id: resource.id,
              resource_type: resource.type
            }))
          );

        if (resourceError) {
          throw resourceError;
        }
      }
    }

    // Update reminders
    if (reminders !== undefined) {
      await this.supabase
        .from('appointment_reminders')
        .delete()
        .eq('appointment_id', id);

      if (reminders.length > 0) {
        const { error: reminderError } = await this.supabase
          .from('appointment_reminders')
          .insert(
            reminders.map((reminder) => ({
              appointment_id: id,
              type: reminder.type,
              scheduled_time: reminder.scheduled_time
            }))
          );

        if (reminderError) {
          throw reminderError;
        }
      }
    }

    return this.getAppointmentById(id);
  }

  async cancelAppointment(id: string, reason: string, userId: string | undefined) {
    const { data: appointment, error } = await this.supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        cancellation_time: new Date().toISOString(),
        cancelled_by: userId
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return this.getAppointmentById(id);
  }

  async addCommentToAppointment(id: string, content: string, userId: string | undefined) {
    const { data: comment, error } = await this.supabase
      .from('appointment_comments')
      .insert({
        appointment_id: id,
        user_id: userId,
        content
      })
      .select(`
        *,
        user:users(id, email, raw_user_meta_data)
      `)
      .single();

    if (error) {
      throw error;
    }

    return comment;
  }
}