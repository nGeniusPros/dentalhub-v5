export const routes = {
  root: '/',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email'
  },
  admin: {
    root: '/admin',
    dashboard: '/admin/dashboard',
    insurance: {
      root: '/admin/insurance',
      plans: '/admin/insurance/plans',
      providers: '/admin/insurance/providers',
      claims: '/admin/insurance/claims'
    },
    procedures: {
      root: '/admin/procedures',
      codes: '/admin/procedures/codes',
      categories: '/admin/procedures/categories'
    },
    patients: {
      root: '/admin/patients',
      list: '/admin/patients/list',
      create: '/admin/patients/create',
      view: (id: string) => `/admin/patients/${id}`,
      edit: (id: string) => `/admin/patients/${id}/edit`
    },
    staff: {
      root: '/admin/staff',
      list: '/admin/staff/list',
      create: '/admin/staff/create',
      view: (id: string) => `/admin/staff/${id}`,
      edit: (id: string) => `/admin/staff/${id}/edit`
    },
    settings: {
      root: '/admin/settings',
      practice: '/admin/settings/practice',
      billing: '/admin/settings/billing',
      integrations: '/admin/settings/integrations'
    }
  },
  patient: {
    root: '/patient',
    dashboard: '/patient/dashboard',
    appointments: {
      root: '/patient/appointments',
      upcoming: '/patient/appointments/upcoming',
      past: '/patient/appointments/past',
      book: '/patient/appointments/book'
    },
    records: {
      root: '/patient/records',
      treatments: '/patient/records/treatments',
      documents: '/patient/records/documents',
      xrays: '/patient/records/xrays'
    },
    billing: {
      root: '/patient/billing',
      invoices: '/patient/billing/invoices',
      payments: '/patient/billing/payments',
      insurance: '/patient/billing/insurance'
    }
  },
  staff: {
    root: '/staff',
    dashboard: '/staff/dashboard',
    schedule: '/staff/schedule',
    patients: '/staff/patients',
    tasks: '/staff/tasks'
  },
  api: {
    root: '/api',
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
      refresh: '/api/auth/refresh'
    },
    insurance: {
      plans: '/api/insurance/plans',
      providers: '/api/insurance/providers',
      claims: '/api/insurance/claims'
    },
    procedures: {
      codes: '/api/procedures/codes',
      categories: '/api/procedures/categories'
    },
    patients: {
      root: '/api/patients',
      appointments: '/api/patients/appointments',
      records: '/api/patients/records'
    }
  }
} as const;

export type AppRoutes = typeof routes;
export type ApiRoutes = typeof routes.api;
