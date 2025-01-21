export const ROUTES = {
  HOME: '/',
  LOGIN: {
    PATIENT: '/login/patient',
    STAFF: '/login/staff',
    ADMIN: '/login/admin'
  },
  DASHBOARD: {
    PATIENT: '/patient-dashboard',
    STAFF: '/staff-dashboard',
    ADMIN: '/admin-dashboard',
    RESOURCES: '/admin-dashboard/resources'
  }
} as const;