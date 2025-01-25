import { vi } from 'vitest';

export const aiApiService = {
  processRequest: vi.fn().mockResolvedValue({
    success: true,
    data: 'Mock response'
  }),
  initializeSession: vi.fn().mockResolvedValue({ sessionId: 'mock-session-id' }),
  handleError: vi.fn().mockImplementation((error) => ({
    errorCode: 'MOCK_ERROR',
    message: 'Mock error message'
  }))
};