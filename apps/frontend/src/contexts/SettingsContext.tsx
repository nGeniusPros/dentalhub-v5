import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Settings, SettingsAction, SettingsState } from '../types/settings';

const initialState: SettingsState = {
  settings: {
    general: {
      practiceName: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD'
    },
    branding: {
      logo: '',
      colors: {
        primary: '#1B2B5B',
        secondary: '#40E0D0',
        accent: '#C5A572'
      },
      darkMode: false
    },
    notifications: {
      email: true,
      sms: true,
      appointments: true,
      marketing: false,
      reminderTiming: 24
    },
    security: {
      twoFactorAuth: false,
      passwordExpiration: 90,
      loginAttempts: 3,
      sessionTimeout: 30,
      ipWhitelist: [],
      enforcePasswordPolicy: true,
      ipWhitelistEnabled: false,
      auditLogging: true
    },
    integrations: {
      autoSync: true,
      errorNotifications: true,
      enabled: {}
    },
    targetAudience: {
      demographics: {
        ageRanges: ['25-34', '35-44', '45-54'],
        householdTypes: ['Single', 'Family', 'Student', 'Renter', 'Homeowner'],
        education: ['High School', 'Some College', 'Bachelor\'s Degree', 'Graduate Degree'],
        occupations: ['Professional', 'Business Owner', 'Student', 'Retired'],
        incomeRanges: ['$25k-$50k', '$50k-$75k', '$75k-$100k', '$100k+'],
        locations: ['Urban', 'Suburban', 'Rural']
      },
      interests: []
    },
    features: {}
  },
  loading: false,
  error: null
};

const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
  switch (action.type) {
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: action.payload,
        loading: false,
        error: null
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        },
        loading: false,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

const SettingsContext = createContext<{
  state: SettingsState;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  resetSettings: () => void;
} | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        dispatch({ type: 'SET_SETTINGS', payload: parsed });
      } catch (error) {
        console.error('Error loading settings:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load settings' });
      }
    }
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedSettings = {
        ...state.settings,
        ...newSettings
      };
      
      // Save to localStorage
      localStorage.setItem('settings', JSON.stringify(updatedSettings));
      
      dispatch({ type: 'SET_SETTINGS', payload: updatedSettings });
    } catch (error) {
      console.error('Error updating settings:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update settings' });
    }
  };

  const resetSettings = () => {
    localStorage.removeItem('settings');
    dispatch({ type: 'SET_SETTINGS', payload: initialState.settings });
  };

  return (
    <SettingsContext.Provider value={{ state, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};