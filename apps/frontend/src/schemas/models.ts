import { z } from "zod";

export const AddressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "ZIP code must be at least 5 characters"),
});

export const PatientSchema = z.object({
  id: z.string().uuid("Invalid patient ID"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Invalid gender" }),
  }),
  address: AddressSchema,
});

export const StaffSchema = z.object({
  id: z.string().uuid("Invalid staff ID"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  terminationDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
  status: z.enum(["active", "inactive", "on-leave"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  salary: z.number().positive("Salary must be positive"),
  payFrequency: z.enum(["weekly", "bi-weekly", "monthly"], {
    errorMap: () => ({ message: "Invalid pay frequency" }),
  }),
  rdaLicense: z.string().optional(),
  rdaExpiration: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
});

export const AppointmentSchema = z.object({
  id: z.string().uuid("Invalid appointment ID"),
  patientId: z.string().uuid("Invalid patient ID"),
  staffId: z.string().uuid("Invalid staff ID"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  duration: z.number().int().positive("Duration must be a positive integer"),
  status: z.enum(["scheduled", "confirmed", "cancelled", "completed"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
});

export type Patient = z.infer<typeof PatientSchema>;
export type Staff = z.infer<typeof StaffSchema>;
export type Appointment = z.infer<typeof AppointmentSchema>;
