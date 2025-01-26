import { ISO8601String, UUID, Timestamps } from "./common.js";
export type AppointmentStatus = "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show";
export type AppointmentType = "initial" | "follow-up" | "cleaning" | "procedure" | "emergency" | "consultation";
export interface AppointmentProcedure {
    code: string;
    description: string;
    duration: number;
    fee?: number;
}
export interface Appointment extends Timestamps {
    id: UUID;
    practiceId: UUID;
    patientId: UUID;
    providerId: UUID;
    type: AppointmentType;
    status: AppointmentStatus;
    startTime: ISO8601String;
    endTime: ISO8601String;
    duration: number;
    procedures: AppointmentProcedure[];
    notes?: string;
    cancellationReason?: string;
    reminders: Array<{
        type: "email" | "sms" | "phone";
        scheduledFor: ISO8601String;
        status: "pending" | "sent" | "failed";
    }>;
}
export interface AppointmentRequest {
    patientId: UUID;
    providerId: UUID;
    type: AppointmentType;
    startTime: ISO8601String;
    duration: number;
    procedures: Array<{
        code: string;
        description: string;
    }>;
    notes?: string;
}
//# sourceMappingURL=appointment.d.ts.map