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
    PATIENTS: '/admin/patients',
    STAFF: '/admin/staff',
    ANALYTICS: '/admin/analytics',
    MEMBERSHIP: '/admin/membership',
    COMMUNICATIONS: {
      EMAIL: '/admin/communications/email',
      SMS: '/admin/communications/sms',
      VOICE: '/admin/communications/voice'
    },
    AI_CONSULTANT: '/admin/ai-consultant',
    SETTINGS: '/admin/settings'
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