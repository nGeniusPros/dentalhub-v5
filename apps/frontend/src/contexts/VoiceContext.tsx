import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { 
  RetellAgent, 
  AgentStats, 
  VoiceCampaign, 
  AgentAnalytics 
} from '../types/voice';
import { voiceApi } from '../api/voice';

interface VoiceState {
  agents: RetellAgent[];
  agentStats: Record<string, AgentStats>;
  campaigns: VoiceCampaign[];
  analytics: Record<string, AgentAnalytics>;
  loading: boolean;
  error: string | null;
}

type VoiceAction =
  | { type: 'SET_AGENTS'; payload: RetellAgent[] }
  | { type: 'SET_AGENT_STATS'; payload: { agentId: string; stats: AgentStats } }
  | { type: 'SET_CAMPAIGNS'; payload: VoiceCampaign[] }
  | { type: 'SET_ANALYTICS'; payload: { agentId: string; analytics: AgentAnalytics } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: VoiceState = {
  agents: [],
  agentStats: {},
  campaigns: [],
  analytics: {},
  loading: false,
  error: null,
};

function voiceReducer(state: VoiceState, action: VoiceAction): VoiceState {
  switch (action.type) {
    case 'SET_AGENTS':
      return { ...state, agents: action.payload };
    case 'SET_AGENT_STATS':
      return {
        ...state,
        agentStats: {
          ...state.agentStats,
          [action.payload.agentId]: action.payload.stats,
        },
      };
    case 'SET_CAMPAIGNS':
      return { ...state, campaigns: action.payload };
    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          [action.payload.agentId]: action.payload.analytics,
        },
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const VoiceContext = createContext<{
  state: VoiceState;
  dispatch: React.Dispatch<VoiceAction>;
  refreshAgents: () => Promise<void>;
  refreshCampaigns: () => Promise<void>;
  updateAgentSettings: (agentId: string, settings: Partial<RetellAgent>) => Promise<void>;
  assignCampaignAgent: (campaignId: string, agentId: string) => Promise<void>;
} | null>(null);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(voiceReducer, initialState);

  const refreshAgents = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const agents = await voiceApi.getAgents();
      dispatch({ type: 'SET_AGENTS', payload: agents });
      
      // Fetch stats for each agent
      await Promise.all(
        agents.map(async (agent) => {
          const stats = await voiceApi.getAgentStats(agent.id);
          dispatch({
            type: 'SET_AGENT_STATS',
            payload: { agentId: agent.id, stats },
          });
        })
      );
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch agents' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const refreshCampaigns = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const campaigns = await voiceApi.getCampaigns();
      dispatch({ type: 'SET_CAMPAIGNS', payload: campaigns });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch campaigns' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateAgentSettings = async (agentId: string, settings: Partial<RetellAgent>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await voiceApi.updateAgentSettings(agentId, settings);
      await refreshAgents();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update agent settings' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const assignCampaignAgent = async (campaignId: string, agentId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await voiceApi.assignCampaignAgent(campaignId, agentId);
      await refreshCampaigns();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to assign agent to campaign' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Initial data load
  useEffect(() => {
    refreshAgents();
    refreshCampaigns();
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        state,
        dispatch,
        refreshAgents,
        refreshCampaigns,
        updateAgentSettings,
        assignCampaignAgent,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}
