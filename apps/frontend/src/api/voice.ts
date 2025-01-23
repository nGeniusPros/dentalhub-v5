import type { 
  RetellAgent, 
  AgentStats, 
  AgentAvailability, 
  VoiceCampaign,
  AgentAnalytics
} from '../types/voice';

class VoiceAPI {
  private baseUrl: string;
  private wsUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_RETELL_BASE_URL || 'https://api.retellai.com/v1';
    this.wsUrl = import.meta.env.VITE_RETELL_WEBSOCKET_URL || 'wss://api.retellai.com/v1/websocket';
    this.apiKey = import.meta.env.VITE_RETELL_API_KEY || '';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Retell API key is not configured');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Agent Management
  async getAgents(): Promise<RetellAgent[]> {
    return this.request<RetellAgent[]>('/agents');
  }

  async getAgentStats(agentId: string): Promise<AgentStats> {
    return this.request<AgentStats>(`/agents/${agentId}/stats`);
  }

  async updateAgentSettings(agentId: string, settings: Partial<RetellAgent>): Promise<void> {
    await this.request(`/agents/${agentId}`, {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  }

  async getAgentAvailability(): Promise<AgentAvailability[]> {
    return this.request<AgentAvailability[]>('/agents/availability');
  }

  // Campaign Management
  async assignCampaignAgent(campaignId: string, agentId: string): Promise<void> {
    await this.request(`/campaigns/${campaignId}/agent`, {
      method: 'PUT',
      body: JSON.stringify({ agentId }),
    });
  }

  async getCampaigns(): Promise<VoiceCampaign[]> {
    return this.request<VoiceCampaign[]>('/campaigns');
  }

  async getCampaignStats(campaignId: string): Promise<AgentStats> {
    return this.request<AgentStats>(`/campaigns/${campaignId}/stats`);
  }

  // Analytics
  async getAgentAnalytics(agentId: string, timeRange: { start: string; end: string }): Promise<AgentAnalytics> {
    return this.request<AgentAnalytics>(`/agents/${agentId}/analytics`, {
      method: 'POST',
      body: JSON.stringify(timeRange),
    });
  }

  // WebSocket Connection
  connectWebSocket(callbacks: {
    onMessage: (data: any) => void;
    onError: (error: any) => void;
    onClose: () => void;
  }): WebSocket {
    const ws = new WebSocket(this.wsUrl);

    ws.onmessage = (event) => callbacks.onMessage(JSON.parse(event.data));
    ws.onerror = (error) => callbacks.onError(error);
    ws.onclose = () => callbacks.onClose();

    return ws;
  }
}

export const voiceApi = new VoiceAPI();
