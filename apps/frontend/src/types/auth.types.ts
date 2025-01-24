/**
 * Defines all valid user roles in the system
 * @typedef {string} UserRole
 *
 * @property {'admin'} admin - Full system access
 * @property {'dentist'} dentist - Clinical provider with prescribing privileges
 * @property {'hygienist'} hygienist - Dental cleaning and preventive care
 * @property {'staff'} staff - Administrative and support roles
 * @property {'patient'} patient - Clinic patient access
 */
export type UserRole =
  | 'admin'
  | 'dentist'
  | 'hygienist'
  | 'staff'
  | 'patient';