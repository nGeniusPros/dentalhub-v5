export interface Settings {
  general: {
    practiceName: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  branding: {
    logo?: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    darkMode: boolean;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    appointments: boolean;
    marketing: boolean;
    reminderTiming: number;
  };
  security: {
    twoFactorAuth: boolean;
    passwordExpiration: number;
    loginAttempts: number;
    sessionTimeout: number;
    ipWhitelist: string[];
    enforcePasswordPolicy: boolean;
    ipWhitelistEnabled: boolean;
    auditLogging: boolean;
  };
  integrations: {
    autoSync: boolean;
    errorNotifications: boolean;
    enabled: Record<string, boolean>;
  };
  targetAudience: {
    demographics: {
      ageRanges: string[];
      householdTypes: string[];
      education: string[];
      occupations: string[];
      incomeRanges: string[];
      locations: string[];
    };
    interests: string[];
  };
  features: {
    [key: string]: boolean;
  };
}

export interface SettingsState {
  settings: Settings;
  loading: boolean;
  error: string | null;
}

export type SettingsAction =
  | { type: 'SET_SETTINGS'; payload: Settings }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };