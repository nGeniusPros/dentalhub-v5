import OpenAI from "openai";
import { AIService } from "./types";
import { AIResponse, GenerationOptions } from "../../lib/ai-agents/types";
import {
  AssistantType,
  OpenAIServiceConfig,
  AssistantResponse,
} from "./openai.types";

export class OpenAIService implements AIService {
  private assistants: Map<AssistantType, OpenAI>;
  private activeThreads: Map<string, string> = new Map(); // threadId -> assistantId

  constructor() {
    this.assistants = new Map();
    this.initializeAssistants();
  }

  private initializeAssistants() {
    console.log("Initializing OpenAI assistants...");

    const assistantConfigs: [AssistantType, string, string][] = [
      [
        "brain-consultant",
        import.meta.env.VITE_OPENAI_BRAIN_CONSULTANT_ID!,
        import.meta.env.VITE_OPENAI_BRAIN_CONSULTANT_API_KEY!,
      ],
      [
        "marketing-coaching",
        import.meta.env.VITE_OPENAI_MARKETINGCOACHING_ID!,
        import.meta.env.VITE_OPENAI_MARKETING_COACHING_API_KEY!,
      ],
      [
        "data-retrieval",
        import.meta.env.VITE_OPENAI_DATA_RETRIEVAL_ID!,
        import.meta.env.VITE_OPENAI_DATA_RETRIEVAL_API_KEY!,
      ],
      [
        "profitability",
        import.meta.env.VITE_OPENAI_PROFITABILITY_APPOINTMENT_ID!,
        import.meta.env.VITE_OPENAI_PROFITABILITY_APPOINTMENT_API_KEY!,
      ],
      [
        "recommendation",
        import.meta.env.VITE_OPENAI_RECOMMENDATION_ID!,
        import.meta.env.VITE_OPENAI_RECOMMENDATION_API_KEY!,
      ],
      [
        "analysis",
        import.meta.env.VITE_OPENAI_ANALYSIS_ID!,
        import.meta.env.VITE_OPENAI_ANALYSIS_API_KEY!,
      ],
      [
        "patient-care",
        import.meta.env.VITE_OPENAI_Patient_Care_Agent!,
        import.meta.env.VITE_OPENAI_Patient_Care_API_KEY!,
      ],
      [
        "operations",
        import.meta.env.VITE_Operations_Agent!,
        import.meta.env.VITE_OPENAI_Operations_Agent_API_KEY!,
      ],
      [
        "staff-training",
        import.meta.env.VITE_OPENAI_Staff_Training_Agent!,
        import.meta.env.VITE_OPENAI_Staff_Training_Agent_API_KEY!,
      ],
      [
        "lab-case-manager",
        import.meta.env.VITE_OPENAI_Lab_Case_Manager_Agent!,
        import.meta.env.VITE_OPENAI_Lab_Case_Manager_Agent_API_KEY!,
      ],
      [
        "procedure-code",
        import.meta.env.VITE_OPENAI_Procedure_Code_Agent!,
        import.meta.env.VITE_OPENAI_Procedure_Code_Agent_API_KEY!,
      ],
      [
        "supplies-manager",
        import.meta.env.VITE_OPENAI_Supplies_Manager_Agent!,
        import.meta.env.VITE_OPENAI_Supplies_Manager_Agent_API_KEY!,
      ],
      [
        "marketing-roi",
        import.meta.env.VITE_OPENAI_Marketing_ROI_Agent!,
        import.meta.env.VITE_OPENAI_Marketing_ROI_Agent_API_KEY!,
      ],
      [
        "hygiene-analytics",
        import.meta.env.VITE_OPENAI_Hygiene_Analytics_Agent!,
        import.meta.env.VITE_OPENAI_Hygiene_Analytics_Agent_API_KEY!,
      ],
      [
        "patient-demographics",
        import.meta.env.VITE_OPENAI_Patient_Demographics_Agent!,
        import.meta.env.VITE_OPENAI_Patient_Demographics_Agent_API_KEY!,
      ],
      [
        "osha-compliance",
        import.meta.env.VITE_OPENAI_OSHA_Compliance_Agent!,
        import.meta.env.VITE_OPENAI_OSHA_Compliance_Agent_API_KEY!,
      ],
    ];

    for (const [type, assistantId, apiKey] of assistantConfigs) {
      if (!assistantId || !apiKey) {
        console.warn(`Missing configuration for ${type} assistant:`, {
          hasAssistantId: !!assistantId,
          hasApiKey: !!apiKey,
        });
        continue;
      }

      console.log(`Configuring ${type} assistant...`);
      try {
        // Create OpenAI client with base URL set to the project's API endpoint
        const client = new OpenAI({
          apiKey,
          baseURL: "https://api.openai.com/v1/project",
          dangerouslyAllowBrowser: true,
        });

        // Store both the client and assistant ID
        this.assistants.set(type, client);
        console.log(`Successfully configured ${type} assistant`);
      } catch (error) {
        console.error(`Error configuring ${type} assistant:`, error);
      }
    }

    console.log(
      "Finished initializing assistants. Total configured:",
      this.assistants.size,
    );
  }

  private async createThread(openai: OpenAI): Promise<string> {
    const thread = await openai.beta.threads.create();
    return thread.id;
  }

  private async addMessageToThread(
    openai: OpenAI,
    threadId: string,
    content: string,
  ): Promise<void> {
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content,
    });
  }

  private async runAssistant(
    openai: OpenAI,
    assistantId: string,
    threadId: string,
    options?: GenerationOptions,
  ): Promise<OpenAI.Beta.Threads.Runs.Run> {
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      instructions: options?.systemPrompt,
    });

    return run;
  }

  private async waitForRunCompletion(
    openai: OpenAI,
    threadId: string,
    runId: string,
  ): Promise<OpenAI.Beta.Threads.Runs.Run> {
    let run: OpenAI.Beta.Threads.Runs.Run;

    do {
      run = await openai.beta.threads.runs.retrieve(threadId, runId);
      if (
        run.status === "failed" ||
        run.status === "expired" ||
        run.status === "cancelled"
      ) {
        throw new Error(`Assistant run failed with status: ${run.status}`);
      }
      if (run.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } while (run.status !== "completed");

    return run;
  }

  private async getThreadMessages(
    openai: OpenAI,
    threadId: string,
  ): Promise<OpenAI.Beta.Threads.Messages.ThreadMessagesPage> {
    return await openai.beta.threads.messages.list(threadId);
  }

  async generateResponse(
    prompt: string,
    options?: GenerationOptions & { assistantType?: AssistantType },
  ): Promise<AssistantResponse> {
    // Always start with the brain consultant for orchestration
    const brainConsultant = this.assistants.get("brain-consultant");

    if (!brainConsultant) {
      console.error(
        "Brain consultant not configured. Available assistants:",
        Array.from(this.assistants.keys()),
      );
      throw new Error("Brain consultant not configured");
    }

    try {
      console.log("Creating thread for brain consultant...");
      const mainThreadId = await this.createThread(brainConsultant);

      console.log("Adding message to thread:", prompt);
      await this.addMessageToThread(brainConsultant, mainThreadId, prompt);

      console.log("Running brain consultant...");
      const brainRun = await this.runAssistant(
        brainConsultant,
        import.meta.env.VITE_OPENAI_BRAIN_CONSULTANT_ID!,
        mainThreadId,
        {
          systemPrompt: `You are the Head Brain Consultant for the AI_Consultant system. 
          Analyze the user's query and provide a direct, helpful response.
          If you need data or specialized knowledge, you can:
          1. Request data from Sikka API through the data-retrieval agent
          2. Consult with specialized agents for specific domains
          3. Coordinate multiple agents if needed
          
          Respond in a clear, natural way without exposing the internal agent coordination.`,
        },
      );

      console.log("Waiting for brain consultant completion...");
      await this.waitForRunCompletion(
        brainConsultant,
        mainThreadId,
        brainRun.id,
      );

      console.log("Getting brain consultant response...");
      const brainMessages = await this.getThreadMessages(
        brainConsultant,
        mainThreadId,
      );
      const brainResponse = brainMessages.data[0];

      if (
        !brainResponse ||
        !brainResponse.content ||
        brainResponse.content.length === 0
      ) {
        throw new Error("Empty response from brain consultant");
      }

      let responseContent = "";
      if (brainResponse.content[0].type === "text") {
        const textResponse = brainResponse.content[0].text.value;
        console.log("Brain consultant raw response:", textResponse);

        try {
          // Try to parse as JSON for structured responses
          const analysis = JSON.parse(textResponse);

          // Handle structured response
          if (analysis.needsSikkaData) {
            console.log("Fetching Sikka data...");
            const dataResponse = await this.runSpecializedAgent(
              "data-retrieval",
              analysis.dataQuery,
              mainThreadId,
            );

            if (analysis.requiredAgents && analysis.requiredAgents.length > 0) {
              console.log(
                "Running specialized agents:",
                analysis.requiredAgents,
              );
              const agentResponses = await Promise.all(
                analysis.requiredAgents.map((agentType) =>
                  this.runSpecializedAgent(
                    agentType,
                    analysis.agentQueries[agentType],
                    mainThreadId,
                  ),
                ),
              );

              // Aggregate responses
              const aggregateData = {
                sikkaData: dataResponse,
                agentResponses,
              };

              await this.addMessageToThread(
                brainConsultant,
                mainThreadId,
                JSON.stringify(aggregateData),
              );

              const finalRun = await this.runAssistant(
                brainConsultant,
                import.meta.env.VITE_OPENAI_BRAIN_CONSULTANT_ID!,
                mainThreadId,
              );

              await this.waitForRunCompletion(
                brainConsultant,
                mainThreadId,
                finalRun.id,
              );
              const finalMessages = await this.getThreadMessages(
                brainConsultant,
                mainThreadId,
              );
              responseContent =
                finalMessages.data[0].content[0].type === "text"
                  ? finalMessages.data[0].content[0].text.value
                  : "Error: Invalid response format";
            } else {
              responseContent = textResponse;
            }
          } else {
            responseContent = textResponse;
          }
        } catch (parseError) {
          // If not JSON, use the raw text response
          console.log("Using raw text response");
          responseContent = textResponse;
        }
      } else {
        throw new Error("Invalid response format from brain consultant");
      }

      return {
        content: responseContent,
        threadId: mainThreadId,
      };
    } catch (error) {
      console.error("Error in generateResponse:", error);
      throw error;
    }
  }

  private async runSpecializedAgent(
    agentType: AssistantType,
    query: string,
    parentThreadId: string,
  ): Promise<string> {
    const agent = this.assistants.get(agentType);
    if (!agent) {
      throw new Error(`Agent ${agentType} not configured`);
    }

    const threadId = await this.createThread(agent);
    await this.addMessageToThread(agent, threadId, query);

    const assistantId = import.meta.env[
      `VITE_OPENAI_${agentType.toUpperCase()}_ID`
    ]!;
    const run = await this.runAssistant(agent, assistantId, threadId);

    await this.waitForRunCompletion(agent, threadId, run.id);
    const messages = await this.getThreadMessages(agent, threadId);

    return messages.data[0].content[0].type === "text"
      ? messages.data[0].content[0].text.value
      : "";
  }

  async generateStreamingResponse(
    prompt: string,
    options: GenerationOptions & { assistantType?: AssistantType } = {},
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    try {
      const response = await this.generateResponse(prompt, options);
      // Since the Assistants API doesn't support streaming yet, we'll simulate it
      const chunks = response.content.match(/.{1,4}|.+/g) || [];
      for (const chunk of chunks) {
        onChunk(chunk);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    } catch (error) {
      console.error("OpenAI Streaming Error:", error);
      throw new Error("Failed to generate streaming AI response");
    }
  }
}

export const openAIService = new OpenAIService();
