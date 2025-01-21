import { externalService } from '../services/external';

// Mock fetch
global.fetch = jest.fn();

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mocked response' } }]
        })
      }
    }
  }));
});

describe('External Service End-to-End Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should successfully verify insurance with Sikka', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ status: 'verified' })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const data = {
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '2000-01-01',
      insuranceId: 'TEST123',
    };

    const response = await externalService.sikka.verifyInsurance(data);
    expect(response).toBeDefined();
    expect(response.status).toBe('verified');
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/sikka/verify-insurance',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    );
  });

  it('should successfully get call status from Retell', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ status: 'completed' })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const response = await externalService.retell.getCallStatus('test-call-id');
    expect(response).toBeDefined();
    expect(response.status).toBe('completed');
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/retell/call-status/test-call-id',
      expect.objectContaining({
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('should successfully generate appointment summary with OpenAI', async () => {
    const response = await externalService.openai.generateAppointmentSummary('Test notes');
    expect(response).toBe('Mocked response');
  });

  it('should handle API errors gracefully', async () => {
    const mockErrorResponse = {
      ok: false,
      json: () => Promise.resolve({ message: 'API Error' })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockErrorResponse);

    await expect(externalService.sikka.verifyInsurance({})).rejects.toThrow();
  });
});