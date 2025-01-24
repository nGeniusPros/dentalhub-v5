var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import OpenAI from 'openai';
import { Redis } from 'ioredis';
import { rateLimit } from '@dental/core/middleware';
import { AiServiceError } from '@dental/core/ai/errors';
let OpenAIService = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _createChatCompletion_decorators;
    let _getThreadMessages_decorators;
    let _createThread_decorators;
    let _addMessageToThread_decorators;
    let _runAssistant_decorators;
    return _a = class OpenAIService {
            constructor() {
                this.client = __runInitializers(this, _instanceExtraInitializers);
                // Initialize OpenAI client with API key from environment
                this.client = new OpenAI({
                    apiKey: process.env.OPENAI_API_KEY,
                    organization: process.env.OPENAI_ORG_ID,
                });
                // Initialize Redis for rate limiting
                this.redis = new Redis(process.env.REDIS_URL, {
                    password: process.env.REDIS_PASSWORD,
                    retryStrategy: (times) => Math.min(times * 50, 2000),
                });
            }
            static getInstance() {
                if (!_a.instance) {
                    _a.instance = new _a();
                }
                return _a.instance;
            }
            async createChatCompletion(messages, config, context) {
                try {
                    const response = await this.client.chat.completions.create({
                        messages,
                        model: config.model || 'gpt-4-turbo-preview',
                        temperature: config.temperature,
                        max_tokens: config.maxTokens,
                        user: context.sessionId, // For tracking purposes
                    });
                    // Cache response if Redis is available
                    if (context.sessionId) {
                        await this.redis.setex(`chat:${context.sessionId}:${Date.now()}`, 3600, // 1 hour
                        JSON.stringify({
                            response,
                            metadata: context.metadata,
                        }));
                    }
                    return response;
                }
                catch (error) {
                    throw new AiServiceError('OpenAI API call failed', error);
                }
            }
            async getThreadMessages(threadId) {
                try {
                    const messages = await this.client.beta.threads.messages.list(threadId);
                    return messages.data;
                }
                catch (error) {
                    throw new AiServiceError('Failed to get thread messages', error);
                }
            }
            async createThread() {
                try {
                    return await this.client.beta.threads.create();
                }
                catch (error) {
                    throw new AiServiceError('Failed to create thread', error);
                }
            }
            async addMessageToThread(threadId, content) {
                try {
                    return await this.client.beta.threads.messages.create(threadId, {
                        role: 'user',
                        content,
                    });
                }
                catch (error) {
                    throw new AiServiceError('Failed to add message to thread', error);
                }
            }
            async runAssistant(threadId, assistantId) {
                try {
                    const run = await this.client.beta.threads.runs.create(threadId, {
                        assistant_id: assistantId,
                    });
                    // Wait for completion with timeout
                    const startTime = Date.now();
                    const timeout = 30000; // 30 seconds
                    let status = await this.client.beta.threads.runs.retrieve(threadId, run.id);
                    while ((status.status === 'queued' || status.status === 'in_progress') &&
                        Date.now() - startTime < timeout) {
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                        status = await this.client.beta.threads.runs.retrieve(threadId, run.id);
                    }
                    if (status.status === 'completed') {
                        return await this.getThreadMessages(threadId);
                    }
                    else {
                        throw new Error(`Run failed with status: ${status.status}`);
                    }
                }
                catch (error) {
                    throw new AiServiceError('Failed to run assistant', error);
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _createChatCompletion_decorators = [rateLimit({
                    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
                    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
                })];
            _getThreadMessages_decorators = [rateLimit({
                    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
                    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
                })];
            _createThread_decorators = [rateLimit({
                    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
                    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
                })];
            _addMessageToThread_decorators = [rateLimit({
                    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
                    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
                })];
            _runAssistant_decorators = [rateLimit({
                    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
                    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
                })];
            __esDecorate(_a, null, _createChatCompletion_decorators, { kind: "method", name: "createChatCompletion", static: false, private: false, access: { has: obj => "createChatCompletion" in obj, get: obj => obj.createChatCompletion }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getThreadMessages_decorators, { kind: "method", name: "getThreadMessages", static: false, private: false, access: { has: obj => "getThreadMessages" in obj, get: obj => obj.getThreadMessages }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createThread_decorators, { kind: "method", name: "createThread", static: false, private: false, access: { has: obj => "createThread" in obj, get: obj => obj.createThread }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addMessageToThread_decorators, { kind: "method", name: "addMessageToThread", static: false, private: false, access: { has: obj => "addMessageToThread" in obj, get: obj => obj.addMessageToThread }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _runAssistant_decorators, { kind: "method", name: "runAssistant", static: false, private: false, access: { has: obj => "runAssistant" in obj, get: obj => obj.runAssistant }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { OpenAIService };
