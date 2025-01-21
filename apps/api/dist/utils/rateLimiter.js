const MAX_REQUESTS_PER_MINUTE = 60;
const REQUEST_INTERVAL_MS = 60000 / MAX_REQUESTS_PER_MINUTE;
class RateLimiter {
    constructor() {
        this.lastRequestTime = 0;
        this.requestCount = 0;
    }
    async checkLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < REQUEST_INTERVAL_MS) {
            this.requestCount++;
            if (this.requestCount > MAX_REQUESTS_PER_MINUTE) {
                const delay = REQUEST_INTERVAL_MS - timeSinceLastRequest;
                await new Promise(resolve => setTimeout(resolve, delay));
                this.requestCount = 1;
            }
        }
        else {
            this.requestCount = 1;
        }
        this.lastRequestTime = Date.now();
    }
}
export const rateLimiter = new RateLimiter();
