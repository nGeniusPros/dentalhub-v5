export abstract class BaseAgent {
  protected id: string;
  protected status: 'idle' | 'processing' | 'error';

  constructor(id: string) {
    this.id = id;
    this.status = 'idle';
  }

  getId(): string {
    return this.id;
  }

  getStatus(): 'idle' | 'processing' | 'error' {
    return this.status;
  }

  protected setStatus(status: 'idle' | 'processing' | 'error'): void {
    this.status = status;
  }

  abstract processQuery(query: string): Promise<any>;
}
