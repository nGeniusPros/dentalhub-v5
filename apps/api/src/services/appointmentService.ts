import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types.js';

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

    if (start_date) {
      query = query.gte('start_time', start_date);
    }
    if (end_date) {
      query = query.lte('end_time', end_date);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (provider_id) {
      query = query.eq('provider_id', provider_id);
    }
    if (patient_id) {
      query = query.eq('patient_id', patient_id);
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

  async createAppointment(data: any, userId: string | undefined) {
    const { resources, reminders, ...appointmentData } = data;
    const { data: appointment, error: appointmentError } = await this.supabase
      .from('appointments')
      .insert({
        ...appointmentData,
        created_by: userId
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
          resources.map((resource: any) => ({
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
          reminders.map((reminder: any) => ({
            appointment_id: appointment.id,
            type: reminder.type,
            scheduled_time: reminder.scheduled_time
          }))
        );

      if (reminderError) {
        throw reminderError;
      }
    }

    return appointment;
  }

  async updateAppointment(id: string, data: any) {
    const { resources, reminders, ...appointmentData } = data;
    const { data: appointment, error: appointmentError } = await this.supabase
      .from('appointments')
      .update({
        ...appointmentData
      })
      .eq('id', id)
      .select()
      .single();

    if (appointmentError) {
      throw appointmentError;
    }

    // Update resources
    if (resources) {
      await this.supabase
        .from('appointment_resources')
        .delete()
        .eq('appointment_id', id);

      if (resources.length > 0) {
        const { error: resourceError } = await this.supabase
          .from('appointment_resources')
          .insert(
            resources.map((resource: any) => ({
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
    if (reminders) {
      await this.supabase
        .from('appointment_reminders')
        .delete()
        .eq('appointment_id', id);

      if (reminders.length > 0) {
        const { error: reminderError } = await this.supabase
          .from('appointment_reminders')
          .insert(
            reminders.map((reminder: any) => ({
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

    return appointment;
  }

  async cancelAppointment(id: string, reason: string, userId: string | undefined) {
    return await this.supabase
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
  }

  async addCommentToAppointment(id: string, content: string, userId: string | undefined) {
    return await this.supabase
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
  }
}