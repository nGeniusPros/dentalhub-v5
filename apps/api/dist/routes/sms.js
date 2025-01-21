import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';
const router = Router();
const sendSmsSchema = z.object({
    recipient_id: z.string().min(1),
    message: z.string().min(1),
    template_id: z.string().optional(),
});
const createTemplateSchema = z.object({
    name: z.string().min(1),
    content: z.string().min(1),
    variables: z.any().optional(),
});
const updateTemplateSchema = z.object({
    name: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    variables: z.any().optional(),
});
const deliveryIdSchema = z.object({
    delivery_id: z.string().min(1),
});
const smsAnalyticsSchema = z.object({
    start_date: z.string().optional(),
    end_date: z.string().optional(),
});
const emailWebhookSchema = z.object({
    provider_message_id: z.string().min(1),
    status: z.string().min(1),
    error_message: z.string().optional(),
});
const sendSms = async (recipient_phone, message) => {
    // TODO: Implement SMS provider integration
    console.log(`Sending SMS to ${recipient_phone} with message "${message}"`);
    return { success: true, messageId: `msg_${Date.now()}` };
};
// Send individual SMS
router.post('/send', asyncHandler(async (req, res) => {
    const validationResult = sendSmsSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid SMS data' });
    }
    const { recipient_id, message, template_id } = validationResult.data;
    // Get recipient details
    const { data: recipient, error: recipientError } = await req.supabase
        .from('patients')
        .select('phone, first_name, last_name')
        .eq('id', recipient_id)
        .single();
    if (recipientError) {
        return res.status(500).json({ error: recipientError.message });
    }
    if (!recipient.phone) {
        return res.status(400).json({ error: 'Recipient has no phone number' });
    }
    try {
        // For now, just record the attempt
        const { data: delivery, error: deliveryError } = await req.supabase
            .from('campaign_deliveries')
            .insert({
            recipient_id,
            status: 'sent',
            metadata: {
                message,
                template_id,
                recipient_phone: recipient.phone
            },
            sent_at: new Date().toISOString()
        })
            .select()
            .single();
        if (deliveryError) {
            throw deliveryError;
        }
        const smsResult = await sendSms(recipient.phone, message);
        return res.json({ ...delivery, smsResult });
    }
    catch (error) {
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to send SMS'
        });
    }
}));
// Get SMS templates
router.get('/templates', asyncHandler(async (req, res) => {
    const { data: templates, error } = await req.supabase
        .from('sms_templates')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json(templates);
}));
// Create SMS template
router.post('/templates', asyncHandler(async (req, res) => {
    const validationResult = createTemplateSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid template data' });
    }
    const { name, content, variables } = validationResult.data;
    const { data: template, error } = await req.supabase
        .from('sms_templates')
        .insert({
        name,
        content,
        variables
    })
        .select()
        .single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(template);
}));
// Update SMS template
router.put('/templates/:id', asyncHandler(async (req, res) => {
    const validationResult = updateTemplateSchema.safeParse(req.body);
    const idValidationResult = z.object({ id: z.string().min(1) }).safeParse(req.params);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid template data' });
    }
    if (!idValidationResult.success) {
        return res.status(400).json({ error: 'Invalid template ID' });
    }
    const { id } = idValidationResult.data;
    const { name, content, variables } = validationResult.data;
    const { data: template, error } = await req.supabase
        .from('sms_templates')
        .update({
        name,
        content,
        variables
    })
        .eq('id', id)
        .select()
        .single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json(template);
}));
// Delete SMS template
router.delete('/templates/:id', asyncHandler(async (req, res) => {
    const validationResult = z.object({ id: z.string().min(1) }).safeParse(req.params);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid template ID' });
    }
    const { id } = validationResult.data;
    const { error } = await req.supabase
        .from('sms_templates')
        .delete()
        .eq('id', id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(204).send();
}));
// Get SMS delivery status
router.get('/status/:delivery_id', asyncHandler(async (req, res) => {
    const validationResult = deliveryIdSchema.safeParse(req.params);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid delivery ID' });
    }
    const { delivery_id } = validationResult.data;
    const { data: delivery, error } = await req.supabase
        .from('campaign_deliveries')
        .select('*')
        .eq('id', delivery_id)
        .single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json(delivery);
}));
// Get SMS analytics
router.get('/analytics', asyncHandler(async (req, res) => {
    const validationResult = smsAnalyticsSchema.safeParse(req.query);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid analytics parameters' });
    }
    const { start_date, end_date } = validationResult.data;
    const { data: analytics, error } = await req.supabase
        .from('campaign_analytics')
        .select(`
      id,
      timestamp,
      metrics,
      campaigns!inner(
        id,
        name,
        type
      )
    `)
        .eq('campaigns.type', 'sms')
        .gte('timestamp', start_date)
        .lte('timestamp', end_date)
        .order('timestamp', { ascending: true });
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json(analytics);
}));
// Handle SMS webhook
router.post('/webhook', asyncHandler(async (req, res) => {
    const validationResult = emailWebhookSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid webhook data' });
    }
    const { provider_message_id, status, error_message } = validationResult.data;
    // Update delivery status
    const { data: delivery, error } = await req.supabase
        .from('campaign_deliveries')
        .update({
        status,
        error_message,
        delivered_at: status === 'delivered' ? new Date().toISOString() : null,
        failed_at: status === 'failed' ? new Date().toISOString() : null
    })
        .eq('provider_message_id', provider_message_id)
        .select()
        .single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    // Update campaign metrics
    if (delivery) {
        const { data: campaign, error: campaignError } = await req.supabase
            .from('campaigns')
            .select('metrics')
            .eq('id', delivery.campaign_id)
            .single();
        if (!campaignError && campaign) {
            const metrics = campaign.metrics;
            metrics[status] = (metrics[status] || 0) + 1;
            await req.supabase
                .from('campaigns')
                .update({ metrics })
                .eq('id', delivery.campaign_id);
        }
    }
    return res.json({ success: true });
}));
export default router;
