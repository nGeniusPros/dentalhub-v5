import { DentalAgentType, AIResponse } from "../types/agent-types";
import { AgentFactory } from "../factory/agent-factory";
import {
  HEAD_BRAIN_CONSULTANT_PROMPT,
  HEAD_BRAIN_METRICS,
} from "../prompts/head-brain-consultant";

interface OrchestrationResult {
  summary: string;
  recommendations: string[];
  metrics: Record<string, unknown>;
  agentsInvolved: DentalAgentType[];
}

export class HeadBrainOrchestrator {
  private static instance: HeadBrainOrchestrator;
  private factory: AgentFactory;

  private constructor() {
    this.factory = AgentFactory.getInstance();
  }

  public static getInstance(): HeadBrainOrchestrator {
    if (!HeadBrainOrchestrator.instance) {
      HeadBrainOrchestrator.instance = new HeadBrainOrchestrator();
    }
    return HeadBrainOrchestrator.instance;
  }

  async processQuery(query: string): Promise<OrchestrationResult> {
    const requiredAgents = await this.identifyRequiredAgents(query);
    const responses = await this.gatherAgentResponses(query, requiredAgents);
    return this.synthesizeResponses(responses, requiredAgents);
  }

  private async identifyRequiredAgents(
    query: string,
  ): Promise<DentalAgentType[]> {
    // Use the brain consultant to determine which agents are needed
    const brainConsultant = this.factory.getAgent("BRAIN_CONSULTANT");
    const analysis = await brainConsultant.processQuery(
      `Analyze the following query and identify required agents: ${query}`,
    );

    // Parse the response to get required agents
    // This is a simplified implementation
    return ["DATA_RETRIEVAL", "ANALYSIS", "RECOMMENDATION"];
  }

  private async gatherAgentResponses(
    query: string,
    agents: DentalAgentType[],
  ): Promise<Map<DentalAgentType, AIResponse>> {
    const responses = new Map<DentalAgentType, AIResponse>();

    // First, always get data from Data Retrieval Agent
    const dataAgent = this.factory.getAgent("DATA_RETRIEVAL");
    const data = await dataAgent.processQuery(query);
    responses.set("DATA_RETRIEVAL", data);

    // Then process with other agents in parallel
    const otherAgents = agents.filter((agent) => agent !== "DATA_RETRIEVAL");
    const agentPromises = otherAgents.map(async (agentType) => {
      const agent = this.factory.getAgent(agentType);
      const response = await agent.processQuery(query);
      responses.set(agentType, response);
    });

    await Promise.all(agentPromises);
    return responses;
  }

  private synthesizeResponses(
    responses: Map<DentalAgentType, AIResponse>,
    agents: DentalAgentType[],
  ): OrchestrationResult {
    // Use the brain consultant to synthesize all responses
    const brainConsultant = this.factory.getAgent("BRAIN_CONSULTANT");

    // Combine all responses into a single context
    const context = Array.from(responses.entries())
      .map(([agent, response]) => `${agent} Response: ${response.content}`)
      .join("\n\n");

    // Get final synthesis
    const synthesis = brainConsultant.processQuery(
      `Synthesize the following agent responses into a cohesive recommendation:\n${context}`,
    );

    // This is a simplified implementation
    return {
      summary: synthesis.content,
      recommendations: ["Implement X", "Optimize Y", "Improve Z"],
      metrics: HEAD_BRAIN_METRICS,
      agentsInvolved: agents,
    };
  }
}
