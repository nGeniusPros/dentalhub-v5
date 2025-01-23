/**
 * Utility function to pause execution for a specified duration
 * @param ms Duration to sleep in milliseconds
 * @returns Promise that resolves after the specified duration
 */
export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param maxRetries Maximum number of retry attempts
 * @param baseDelay Base delay in milliseconds (will be multiplied by 2^attempt)
 * @param maxDelay Maximum delay in milliseconds
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 32000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      if (attempt === maxRetries) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt),
        maxDelay
      );

      // Add some jitter to prevent thundering herd
      const jitter = Math.random() * 200;
      await sleep(delay + jitter);
    }
  }

  throw lastError!;
}

/**
 * Run a function with a timeout
 * @param fn Function to run
 * @param timeoutMs Timeout in milliseconds
 * @throws Error if the function doesn't complete within the timeout
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([fn(), timeoutPromise]);
}

/**
 * Debounce a function
 * @param fn Function to debounce
 * @param wait Wait time in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function(...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

/**
 * Create a queue for processing async tasks sequentially
 */
export class AsyncQueue {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;

  /**
   * Add a task to the queue
   * @param task Task to add to the queue
   */
  async add(task: () => Promise<void>): Promise<void> {
    this.queue.push(task);
    if (!this.processing) {
      await this.process();
    }
  }

  private async process(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      try {
        await task();
      } catch (error) {
        console.error('Error processing task:', error);
      }
    }

    this.processing = false;
  }
}
