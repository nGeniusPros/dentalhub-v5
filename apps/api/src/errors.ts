export class AgentError extends Error {
  constructor(
    public code: string,
    message: string,
    public metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AgentError';
  }
}