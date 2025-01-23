import { RetellConfig, AgentConfig } from './types';

function validateConfig(config: Partial<RetellConfig>): asserts config is RetellConfig {
  const required: (keyof RetellConfig)[] = ['apiKey', 'baseUrl', 'webhookUrl'];
  const missing = required.filter(key => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required Retell configuration: ${missing.join(', ')}. ` +
      'Please ensure all required environment variables are set.'
    );
  }
}

function loadAgentConfigs(): AgentConfig[] {
  const agents: AgentConfig[] = [];
  
  // Load all configured agents (up to 3 in current env)
  for (let i = 1; i <= 3; i++) {
    const agentId = process.env[`RETELL_AGENT_${i}_ID`];
    const llmId = process.env[`RETELL_AGENT_${i}_LLM`];
    const phoneNumber = process.env[`RETELL_AGENT_${i}_PHONE`];
    
    if (agentId && llmId && phoneNumber) {
      agents.push({ agentId, llmId, phoneNumber });
    }
  }
  
  return agents;
}

function loadConfig(): RetellConfig {
  const config: Partial<RetellConfig> = {
    apiKey: process.env.RETELL_API_KEY,
    baseUrl: process.env.RETELL_BASE_URL || 'https://api.retellai.com/v1',
    wsUrl: process.env.RETELL_WEBSOCKET_URL || 'wss://api.retellai.com/v1/websocket',
    webhookUrl: process.env.RETELL_WEBHOOK_URL,
    agents: loadAgentConfigs()
  };

  validateConfig(config);
  return config;
}

// Configuration with defaults and validation
export const retellConfig: RetellConfig = {
  ...loadConfig(),
};

// Export individual config values for convenience
export const {
  apiKey: RETELL_API_KEY,
  baseUrl: RETELL_BASE_URL,
  wsUrl: RETELL_WS_URL,
  webhookUrl: RETELL_WEBHOOK_URL,
  webhookSecret: RETELL_WEBHOOK_SECRET,
  agents: RETELL_AGENTS
} = retellConfig;

// Call configuration
export const CALL_CONFIG = {
  maxDuration: 30 * 60, // 30 minutes in seconds
  maxRetries: 2,
  minDelayBetweenCalls: 60, // 1 minute in seconds
  defaultLanguage: 'en-US',
  recordingEnabled: true,
  transcriptionEnabled: true,
  aiAnalysisEnabled: true,
};

// Queue configuration
export const QUEUE_CONFIG = {
  maxConcurrentCalls: 5,
  priorityLevels: {
    high: 1,
    normal: 2,
    low: 3,
  },
  retryDelays: [5000, 15000, 30000], // Delays in milliseconds
  maxRetries: 3,
};

// Webhook configuration
export const WEBHOOK_CONFIG = {
  maxRetries: 3,
  retryDelay: 5000, // 5 seconds
  timeout: 10000, // 10 seconds
  signatureHeader: 'X-Retell-Signature',
};

// Analysis configuration
export const ANALYSIS_CONFIG = {
  sentiment: {
    enabled: true,
    threshold: 0.7,
  },
  intents: {
    enabled: true,
    minConfidence: 0.8,
  },
  entities: {
    enabled: true,
    minConfidence: 0.7,
  },
  summary: {
    enabled: true,
    maxLength: 500,
  },
};