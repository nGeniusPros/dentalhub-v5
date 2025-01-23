export class AgentError extends Error {
    constructor(code, message, metadata) {
        super(message);
        this.code = code;
        this.metadata = metadata;
        this.name = 'AgentError';
    }
}
