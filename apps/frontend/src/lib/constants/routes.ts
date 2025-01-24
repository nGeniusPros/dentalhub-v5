export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    ADMIN_LOGIN: '/admin/login',
    STAFF_LOGIN: '/staff/login',
    PATIENT_LOGIN: '/patient/login'
  },
  ADMIN: {
    ROOT: '/admin',
    // Quick Access
    REVENUE: '/admin/revenue',
    PATIENTS: '/admin/patients',
    SATISFACTION: '/admin/satisfaction',
    TREATMENTS: '/admin/treatments',
    DEMOGRAPHICS: '/admin/demographics',
    REPORTS: '/admin/reports',
    DASHBOARD: '/admin',
    AI: '/admin/ai',
    // Core
    PATIENTS_LIST: '/admin/patients-list',
    APPOINTMENTS: '/admin/appointments',
    ANALYTICS: '/admin/analytics',
    STAFF: '/admin/staff',
    HR: '/admin/hr',
    PLANS: '/admin/plans',
    // Communications
    SMS: '/admin/sms',
    EMAIL: '/admin/email',
    VOICE: '/admin/voice',
    // System
    CONTACTS: '/admin/contacts',
    MARKETPLACE: '/admin/marketplace',
    SETTINGS: '/admin/settings',
    // Resources
    RESOURCES: '/admin/resources'
  },
  STAFF: {
    ROOT: '/staff',
    PATIENTS: '/staff/patients',
    SCHEDULE: '/staff/schedule',
    TREATMENT_PLANS: '/staff/treatment-plans'
  },
  PATIENT: {
    ROOT: '/patient',
    APPOINTMENTS: '/patient/appointments',
    RECORDS: '/patient/records',
    BILLING: '/patient/billing'
  }
} as const;