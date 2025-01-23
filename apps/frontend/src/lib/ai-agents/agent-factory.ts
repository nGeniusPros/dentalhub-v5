import { openAIService } from '../../services/ai/openai.service';
import type { AssistantType } from '../../services/ai/openai.types';

export type AgentType = 
  | 'revenue' 
  | 'patient-care' 
  | 'operations' 
  | 'staff'
  | 'head-brain'
  | 'data-analysis'
  | 'data-retrieval';

interface AgentMetadata {
  version: string;
  capabilities: string[];
  rateLimit?: {
    tokens: number;
    windowMs: number;
  };
}

export interface AIAgent {
  processQuery: (content: string) => Promise<AIResponse>;
}

export class AgentFactory {
  private static instance: AgentFactory;
  private metrics: PracticeMetrics;
  private agentMetadata = new Map<AgentType, AgentMetadata>();
  private rateLimiters = new Map<AgentType, TokenBucket>();
  private openAIService: typeof openAIService;

  private constructor() {
    this.metrics = {
      monthlyRevenue: 0,
      patientCount: 0,
      appointmentRate: 0,
      treatmentAcceptance: 0
    };
    this.openAIService = openAIService;
    
    // Initialize agent metadata
    this.agentMetadata.set('revenue', {
      version: '2.1.0',
      capabilities: ['financial_analysis', 'revenue_optimization'],
      rateLimit: { tokens: 10, windowMs: 60000 }
    });
    this.agentMetadata.set('patient-care', {
      version: '1.3.0',
      capabilities: ['patient_management', 'care_coordination']
    });
    this.agentMetadata.set('operations', {
      version: '1.8.0',
      capabilities: ['operational_optimization', 'resource_scheduling']
    });
    this.agentMetadata.set('staff', {
      version: '1.2.0',
      capabilities: ['staff_management', 'training_coordination']
    });
    this.agentMetadata.set('head-brain', {
      version: '1.0.0',
      capabilities: [
        'query_orchestration',
        'multi_agent_coordination',
        'response_aggregation',
        'data_validation'
      ]
    });
  }

  public static getInstance(): AgentFactory {
    if (!AgentFactory.instance) {
      AgentFactory.instance = new AgentFactory();
      AgentFactory.instance.initializeRateLimiters();
    }
    return AgentFactory.instance;
  }

  private initializeRateLimiters() {
    for (const [agentType, metadata] of this.agentMetadata) {
      if (metadata.rateLimit) {
        this.rateLimiters.set(agentType, new TokenBucket({
          bucketSize: metadata.rateLimit.tokens,
          tokensPerInterval: metadata.rateLimit.tokens,
          interval: metadata.rateLimit.windowMs
        }));
      }
    }
  }

  public updateMetrics(metrics: PracticeMetrics): void {
    this.metrics = metrics;
  }

  public createAgent(type: AgentType): AIAgent {
    // Check rate limits if configured for this agent type
    const limiter = this.rateLimiters.get(type);
    if (limiter && !limiter.tryRemoveTokens(1)) {
      throw new Error(`Rate limit exceeded for agent ${type}`);
    }

    return {
      processQuery: async (content: string) => {
        const assistantType = this.getAssistantType(type);
        return this.openAIService.generateResponse(content, { assistantType });
      }
    };
  }

  private getAssistantType(type: AgentType): AssistantType {
    switch (type) {
      case 'revenue':
        return 'profitability';
      case 'patient-care':
        return 'patient-care';
      case 'operations':
        return 'operations';
      case 'staff':
        return 'staff-training';
      case 'head-brain':
        return 'brain-consultant';
      case 'data-analysis':
        return 'analysis';
      default:
        throw new Error(`Unknown agent type: ${type}`);
    }
  }

  public getAgentMetadata(type: AgentType): AgentMetadata {
    return this.agentMetadata.get(type) || {
      version: 'unknown',
      capabilities: []
    };
  }

  private findAgentsByCapability(capability: string): AgentType[] {
    return Array.from(this.agentMetadata.entries())
      .filter(([_, metadata]) => metadata.capabilities.includes(capability))
      .map(([type]) => type);
  }

  public getAvailableAgents(): Agent[] {
    return [
      {
        id: 'revenue',
        name: 'Revenue Agent',
        description: 'Analyzes financial metrics and revenue optimization',
        category: 'Revenue',
        icon: '💰',
        contextRequirements: ['monthlyRevenue', 'patientCount']
      },
      {
        id: 'patient-care',
        name: 'Patient Care Agent',
        description: 'Manages patient relationships and care quality',
        category: 'Patient Care',
        icon: '🏥',
        contextRequirements: ['patientCount', 'appointmentRate']
      },
      {
        id: 'operations',
        name: 'Operations Agent',
        description: 'Optimizes practice operations and scheduling',
        category: 'Operations',
        icon: '⚙️',
        contextRequirements: ['appointmentRate', 'staffProductivity']
      },
      {
        id: 'staff',
        name: 'Staff Agent',
        description: 'Handles staff management and training',
        category: 'Staff & Training',
        icon: '👥',
        contextRequirements: ['staffProductivity']
      },
      {
        id: 'data-analysis',
        name: 'Data Analysis Agent',
        description: 'Performs in-depth data analysis',
        category: 'Analytics',
        icon: '📊',
        contextRequirements: ['monthlyRevenue', 'patientCount', 'appointmentRate']
      },
      {
        id: 'data-retrieval',
        name: 'Data Retrieval Agent',
        description: 'Retrieves and validates practice data',
        category: 'Core',
        icon: '🔍',
        contextRequirements: ['monthlyRevenue', 'patientCount']
      }
    ];
  }
}

class TokenBucket {
  private tokens: number;
  private lastFilled: number;
  
  constructor(private config: {
    bucketSize: number,
    tokensPerInterval: number,
    interval: number
  }) {
    this.tokens = config.bucketSize;
    this.lastFilled = Date.now();
  }

  tryRemoveTokens(count: number): boolean {
    this.refill();
    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }
    return false;
  }

  private refill() {
    const now = Date.now();
    const elapsed = now - this.lastFilled;
    const refillAmount = Math.floor(elapsed / this.config.interval) * this.config.tokensPerInterval;
    
    this.tokens = Math.min(
      this.config.bucketSize,
      this.tokens + refillAmount
    );
    
    this.lastFilled += Math.floor(elapsed / this.config.interval) * this.config.interval;
  }
}
