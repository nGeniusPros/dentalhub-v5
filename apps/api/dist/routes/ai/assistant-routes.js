import { Router } from 'express';
import { OpenAIService } from '../../services/ai/openai-service';
import { validateRequest } from '@dental/core/middleware';
import { z } from 'zod';
const router = Router();
const openAI = OpenAIService.getInstance();
// Schema for assistant message request
const AssistantMessageSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    metadata: z.record(z.unknown()).optional()
});
// Create a new message in an assistant thread
router.post('/assistant/:assistantId/messages', validateRequest({
    params: z.object({
        assistantId: z.string()
    }),
    body: AssistantMessageSchema
}), async (req, res) => {
    try {
        const { assistantId } = req.params;
        const message = req.body;
        const response = await openAI.createChatCompletion([message], {
            model: 'gpt-4-turbo-preview',
            temperature: 0.7,
            maxTokens: 1000
        }, {
            patientId: req.headers['x-patient-id'],
            sessionId: req.headers['x-session-id'],
            metadata: {
                assistantId,
                ...message.metadata
            }
        });
        res.json({
            content: response.choices[0].message.content,
            metadata: {
                usage: response.usage,
                model: response.model
            }
        });
    }
    catch (error) {
        console.error('Assistant message error:', error);
        res.status(500).json({
            error: {
                message: 'Failed to process assistant message',
                details: error instanceof Error ? error.message : 'Unknown error'
            }
        });
    }
});
// Get thread messages
router.get('/threads/:threadId', validateRequest({
    params: z.object({
        threadId: z.string()
    })
}), async (req, res) => {
    try {
        const { threadId } = req.params;
        const messages = await openAI.getThreadMessages(threadId);
        res.json(messages);
    }
    catch (error) {
        console.error('Get thread messages error:', error);
        res.status(500).json({
            error: {
                message: 'Failed to get thread messages',
                details: error instanceof Error ? error.message : 'Unknown error'
            }
        });
    }
});
export default router;
