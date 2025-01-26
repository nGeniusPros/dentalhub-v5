import React, { createContext, useContext, useMemo } from "react";
import { AgentRegistry } from "@dental/core/ai/agent-registry";
import { AgentConfigSchema } from "@dental/core/ai/types";

type AiContextType = {
  getAgent: (agentId: string) => ReturnType<typeof AgentRegistry.getInstance>;
  config: Partial<AgentConfigSchema>;
};

const AiContext = createContext<AiContextType | null>(null);

export function AiProvider({ children }: { children: React.ReactNode }) {
  const baseConfig = useMemo(
    () => ({
      model: import.meta.env.VITE_OPENAI_MODEL || "gpt-4-turbo-preview",
      baseUrl: import.meta.env.VITE_OPENAI_BASE_URL || "/api/ai",
    }),
    [],
  );

  return (
    <AiContext.Provider
      value={{
        getAgent: (agentId) => AgentRegistry.getInstance().getAgent(agentId),
        config: baseConfig,
      }}
    >
      {children}
    </AiContext.Provider>
  );
}

export const useAi = () => {
  const context = useContext(AiContext);
  if (!context) {
    throw new Error("useAi must be used within an AiProvider");
  }
  return context;
};
