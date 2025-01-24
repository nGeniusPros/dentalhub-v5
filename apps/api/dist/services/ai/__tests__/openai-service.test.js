import { OpenAIService } from '../openai-service';
import { AiServiceError } from '@dental/core/ai/errors';
// Mock OpenAI
vi.mock('openai', () => ({
    default: vi.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: vi.fn()
            }
        },
        beta: {
            threads: {
                create: vi.fn(),
                messages: {
                    create: vi.fn(),
                    list: vi.fn()
                },
                runs: {
                    create: vi.fn(),
                    retrieve: vi.fn()
                }
            }
        }
    }))
}));
describe('OpenAIService', () => {
    let service;
    let mockOpenAI;
    beforeEach(() => {
        vi.clearAllMocks();
        service = OpenAIService.getInstance();
        mockOpenAI = service.client;
    });
    describe('createChatCompletion', () => {
        it('should create a chat completion successfully', async () => {
            const mockResponse = {
                choices: [{ message: { content: 'Test response' } }],
                usage: { total_tokens: 10 }
            };
            mockOpenAI.chat.completions.create.mockResolvedValueOnce(mockResponse);
            const result = await service.createChatCompletion([{ role: 'user', content: 'Test message' }], { model: 'gpt-4-turbo-preview' }, { patientId: '123', sessionId: '456', metadata: {} });
            expect(result).toEqual(mockResponse);
            expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
                messages: [{ role: 'user', content: 'Test message' }],
                model: 'gpt-4-turbo-preview',
                stream: true
            });
        });
        it('should handle API errors', async () => {
            mockOpenAI.chat.completions.create.mockRejectedValueOnce(new Error('API Error'));
            await expect(service.createChatCompletion([{ role: 'user', content: 'Test message' }], { model: 'gpt-4-turbo-preview' }, { patientId: '123', sessionId: '456', metadata: {} })).rejects.toThrow(AiServiceError);
        });
    });
    describe('Thread Management', () => {
        it('should create a thread successfully', async () => {
            const mockThread = { id: 'thread_123' };
            mockOpenAI.beta.threads.create.mockResolvedValueOnce(mockThread);
            const result = await service.createThread();
            expect(result).toEqual(mockThread);
        });
        it('should add a message to thread successfully', async () => {
            const mockMessage = { id: 'msg_123', content: 'Test message' };
            mockOpenAI.beta.threads.messages.create.mockResolvedValueOnce(mockMessage);
            const result = await service.addMessageToThread('thread_123', 'Test message');
            expect(result).toEqual(mockMessage);
        });
        it('should run assistant and get messages successfully', async () => {
            const mockRun = { id: 'run_123' };
            const mockStatus = { status: 'completed' };
            const mockMessages = { data: [{ content: 'Assistant response' }] };
            mockOpenAI.beta.threads.runs.create.mockResolvedValueOnce(mockRun);
            mockOpenAI.beta.threads.runs.retrieve.mockResolvedValueOnce(mockStatus);
            mockOpenAI.beta.threads.messages.list.mockResolvedValueOnce(mockMessages);
            const result = await service.runAssistant('thread_123', 'asst_123');
            expect(result).toEqual(mockMessages.data);
        });
        it('should handle failed runs', async () => {
            const mockRun = { id: 'run_123' };
            const mockStatus = { status: 'failed' };
            mockOpenAI.beta.threads.runs.create.mockResolvedValueOnce(mockRun);
            mockOpenAI.beta.threads.runs.retrieve.mockResolvedValueOnce(mockStatus);
            await expect(service.runAssistant('thread_123', 'asst_123')).rejects.toThrow('Run failed with status: failed');
        });
    });
});
