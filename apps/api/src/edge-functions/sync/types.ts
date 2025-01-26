export interface SyncConfig {
  calendarProvider: "google" | "microsoft" | "ical";
  contactsProvider: "google" | "microsoft" | "vcard";
  calendarApiKey?: string;
  contactsApiKey?: string;
  calendarId?: string;
  contactsListId?: string;
}

export interface CalendarSyncOptions {
  syncDirection: "one-way" | "two-way";
  syncInterval: number; // in minutes
  timeZone?: string;
  eventFilters?: {
    startAfter?: string;
    endBefore?: string;
    attendees?: string[];
  };
}

export interface ContactsSyncOptions {
  syncDirection: "one-way" | "two-way";
  syncInterval: number; // in minutes
  contactFilters?: {
    groups?: string[];
    updatedAfter?: string;
  };
}

export interface SyncData {
  type: "calendar" | "contacts";
  options: CalendarSyncOptions | ContactsSyncOptions;
  metadata?: {
    patientId?: string;
    providerId?: string;
    createdAt?: string;
    syncId?: string;
  };
}

export interface SyncResult {
  success: boolean;
  syncId?: string;
  providerResponse?: any;
  error?: SyncError;
}

export interface SyncError {
  code: string;
  message: string;
  details?: any;
}

export interface SyncStorageOptions {
  bucket: string;
  path: string;
  acl?: "private" | "public-read";
  metadata?: Record<string, string>;
  expiresIn?: number;
}

export interface SyncOptions {
  priority?: "high" | "normal" | "low";
  webhook?: {
    url: string;
    secret: string;
  };
  storage?: SyncStorageOptions;
  config?: SyncConfig;
}
