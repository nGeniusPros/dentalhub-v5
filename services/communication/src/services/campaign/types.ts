export type CampaignType = "voice" | "sms" | "email";
export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "completed"
  | "failed";

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  schedule?: {
    startDate: Date;
    endDate?: Date;
    timezone: string;
  };
  audience: {
    filters: Record<string, any>;
    excludeFilters?: Record<string, any>;
  };
  content: {
    template: string;
    variables?: Record<string, any>;
    attachments?: string[];
  };
  metrics: {
    total: number;
    sent: number;
    delivered: number;
    engaged: number;
    failed: number;
  };
  settings: {
    retryCount?: number;
    retryDelay?: number;
    callbackUrl?: string;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCampaignDTO {
  name: string;
  type: CampaignType;
  schedule?: {
    startDate: Date;
    endDate?: Date;
    timezone: string;
  };
  audience: {
    filters: Record<string, any>;
    excludeFilters?: Record<string, any>;
  };
  content: {
    template: string;
    variables?: Record<string, any>;
    attachments?: string[];
  };
  settings?: {
    retryCount?: number;
    retryDelay?: number;
    callbackUrl?: string;
  };
  metadata?: Record<string, any>;
}

export interface UpdateCampaignDTO {
  name?: string;
  status?: CampaignStatus;
  schedule?: {
    startDate?: Date;
    endDate?: Date;
    timezone?: string;
  };
  audience?: {
    filters?: Record<string, any>;
    excludeFilters?: Record<string, any>;
  };
  content?: {
    template?: string;
    variables?: Record<string, any>;
    attachments?: string[];
  };
  settings?: {
    retryCount?: number;
    retryDelay?: number;
    callbackUrl?: string;
  };
  metrics?: {
    total?: number;
    sent?: number;
    delivered?: number;
    engaged?: number;
    failed?: number;
  };
  metadata?: Record<string, any>;
}

export interface CampaignFilters {
  type?: CampaignType;
  status?: CampaignStatus;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}
