import { AgentConfig } from './types';
export declare class AgentRegistry {
    private static instance;
    private agents;
    private constructor();
    static getInstance(): AgentRegistry;
    registerAgent(name: string, config: Partial<AgentConfig>): {
        name: string;
        config: {
            model: string;
            temperature: number;
            maxTokens: number;
            systemPrompt: string;
        };
        process: () => Promise<string>;
    };
    getAgent(name: string): any;
    private createAgentInstance;
}
