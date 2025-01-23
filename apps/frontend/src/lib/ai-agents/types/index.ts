import { ChatMessage } from '@google/generative-ai';

export interface PracticeMetrics {
  monthlyRevenue: number;
  patientCount: number;
  appointmentRate: number;
  treatmentAcceptance: number;
  staffProductivity?: number;
  hygieneDailyProduction?: number;
  operatoryUtilization?: number;
  collectionRate?: number;
  newPatientCount?: number;
  patientRetentionRate?: number;
  labCaseRedoRate?: number;
  supplyOverheadPercentage?: number;
  marketingROI?: number;
  oshaComplianceScore?: number;
}

export interface AIResponse {
  content: string;
  metadata?: {
    metrics?: Record<string, any>;
    recommendations?: string[];
    priority?: 'high' | 'medium' | 'low';
    nextSteps?: string[];
    category?: string;
  };
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
  icon: string;
  contextRequirements: (keyof PracticeMetrics)[];
}

export type AgentCategory = 
  | 'Revenue'
  | 'Patient Care'
  | 'Operations'
  | 'Staff & Training'
  | 'Lab Management'
  | 'Compliance'
  | 'Marketing'
  | 'Analytics'
  | 'Core'
  | 'Financial'
  | 'Clinical'
  | 'Growth';

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  topK?: number;
  topP?: number;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  agentId?: string;
}

// Specific Agent Interfaces
export interface DataRetrievalMetrics {
  lastSyncTimestamp: number;
  dataQualityScore: number;
  missingDataFields: string[];
}

export interface LabCaseMetrics {
  totalCases: number;
  redoCases: number;
  avgTurnaroundTime: number;
  qualityScore: number;
}

export interface ProcedureCodeMetrics {
  codeUtilization: Record<string, number>;
  missedCodes: string[];
  complianceScore: number;
}

export interface SupplyMetrics {
  inventory: Record<string, number>;
  monthlySpend: number;
  wastageRate: number;
  stockoutCount: number;
}

export interface AppointmentMetrics {
  scheduleUtilization: number;
  noShowRate: number;
  cancellationRate: number;
  revenuePerHour: number;
}

export interface MarketingMetrics {
  campaignROI: Record<string, number>;
  leadConversionRate: number;
  costPerAcquisition: number;
  channelPerformance: Record<string, number>;
}

export interface HygieneMetrics {
  productionPerDay: number;
  reappointmentRate: number;
  perioMaintenanceConversion: number;
  cleaningEfficiencyScore: number;
}

export interface DemographicMetrics {
  ageDistribution: Record<string, number>;
  insuranceDistribution: Record<string, number>;
  treatmentPreferences: Record<string, number>;
  patientLifetimeValue: number;
}

export interface ComplianceMetrics {
  oshaScore: number;
  hipaaScore: number;
  lastAuditDate: number;
  violationCount: number;
}

// Agent Response Types
export interface AgentResponse {
  agentId: string;
  timestamp: number;
  confidence: number;
  content: string;
  metadata?: Record<string, any>;
  requiredActions?: string[];
  relatedAgents?: string[];
}

// Agent Grid Types
export interface AgentGridItem extends Agent {
  isSelected: boolean;
  gridPosition: {
    row: number;
    col: number;
  };
}

export interface AgentGridState {
  selectedAgent: string | null;
  isGridVisible: boolean;
  layout: Record<AgentCategory, AgentGridItem[]>;
}

// Animation Types
export type AnimationDirection = 'up' | 'down' | 'left' | 'right';
export type AnimationType = 'fade' | 'slide' | 'scale' | 'spring';
export type EaseType = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

export interface AnimationConfig {
  type: AnimationType;
  direction?: AnimationDirection;
  duration: number;
  delay?: number;
  ease?: EaseType;
  springConfig?: {
    stiffness: number;
    damping: number;
    mass: number;
  };
}

export interface StaggerConfig extends AnimationConfig {
  staggerChildren: number;
  delayChildren: number;
}
