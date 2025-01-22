export interface RetellAgent {
  id: string;
  name: string;
  phoneNumber: string;
  llmId: string;
  status: 'active' | 'inactive';
  priority: number;
  capabilities: string[];
}

export interface AgentStats {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  avgDuration: number;
  avgResponseTime: number;
  lastActive: string;
}

export interface CampaignAgentSettings {
  agentId?: string;  // specific agent or auto-select
  priority: 'high' | 'normal' | 'low';
  fallbackAgent?: string;
}

export interface AgentDisplay extends RetellAgent {
  callCount: number;   // Total calls handled
  avgCallDuration: number;
  successRate: number;
}

export interface AgentAvailability {
  agentId: string;
  available: boolean;
  nextAvailableTime?: string;
}

// Campaign types
export interface VoiceCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  agentId: string;
  priority: 'high' | 'normal' | 'low';
  totalCalls: number;
  completedCalls: number;
  successRate: number;
  startDate: string;
  endDate?: string;
  schedule?: CampaignSchedule;
}

export interface CampaignSchedule {
  startTime: string;
  endTime: string;
  daysOfWeek: number[];  // 0-6, where 0 is Sunday
  timezone: string;
}

// Analytics types
export interface AgentAnalytics {
  agentId: string;
  performanceMetrics: {
    callVolume: number;
    successRate: number;
    avgCallDuration: number;
    peakUsageTimes: { hour: number; count: number }[];
  };
  callTypes: {
    type: string;
    count: number;
    successRate: number;
  }[];
}
