import { renderHook, act } from "@testing-library/react";
import { useAIAssistant } from "../useAIAssistant";
import { aiApiService } from "../../services/ai-api-service";
import { AiProvider } from "../ai-agents/providers/ai-context-provider";

// Mock the AI API service
vi.mock("../../services/ai-api-service", () => ({
  aiApiService: {
    createThread: vi.fn(),
    addMessageToThread: vi.fn(),
    runAssistant: vi.fn(),
  },
}));

describe("useAIAssistant", () => {
  const mockAssistantId = "asst_123";
  const mockThreadId = "thread_123";
  const mockMessages = [
    { role: "user", content: "Hello" },
    { role: "assistant", content: "Hi there!" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AiProvider>{children}</AiProvider>
  );

  it("should initialize thread successfully", async () => {
    (aiApiService.createThread as jest.Mock).mockResolvedValueOnce({
      threadId: mockThreadId,
    });

    const { result } = renderHook(
      () => useAIAssistant({ assistantId: mockAssistantId }),
      { wrapper },
    );

    await act(async () => {
      await result.current.initializeThread();
    });

    expect(result.current.threadId).toBe(mockThreadId);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should send message and get response successfully", async () => {
    (aiApiService.createThread as jest.Mock).mockResolvedValueOnce({
      threadId: mockThreadId,
    });
    (aiApiService.addMessageToThread as jest.Mock).mockResolvedValueOnce({
      role: "user",
      content: "Hello",
    });
    (aiApiService.runAssistant as jest.Mock).mockResolvedValueOnce(
      mockMessages,
    );

    const { result } = renderHook(
      () => useAIAssistant({ assistantId: mockAssistantId }),
      { wrapper },
    );

    await act(async () => {
      await result.current.sendMessage("Hello");
    });

    expect(result.current.messages).toEqual(mockMessages);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle errors gracefully", async () => {
    const mockError = new Error("API Error");
    const onError = vi.fn();

    (aiApiService.createThread as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(
      () => useAIAssistant({ assistantId: mockAssistantId, onError }),
      { wrapper },
    );

    await act(async () => {
      try {
        await result.current.initializeThread();
      } catch (error) {
        // Error is expected
      }
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.isLoading).toBe(false);
    expect(onError).toHaveBeenCalledWith(mockError);
  });

  it("should reset thread successfully", async () => {
    (aiApiService.createThread as jest.Mock)
      .mockResolvedValueOnce({ threadId: mockThreadId })
      .mockResolvedValueOnce({ threadId: "new_thread_123" });

    const { result } = renderHook(
      () => useAIAssistant({ assistantId: mockAssistantId }),
      { wrapper },
    );

    // Initialize first thread
    await act(async () => {
      await result.current.initializeThread();
    });

    // Reset thread
    await act(async () => {
      await result.current.resetThread();
    });

    expect(result.current.threadId).toBe("new_thread_123");
    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
