import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';
const router = Router();
const sendEmailSchema = z.object({
    recipient_id: z.string().min(1),
    subject: z.string().min(1),
    content: z.string().min(1),
    template_id: z.string().optional(),
});
const createTemplateSchema = z.object({
    name: z.string().min(1),
    subject: z.string().min(1),
    content: z.string().min(1),
    variables: z.any().optional(),
});
const updateTemplateSchema = z.object({
    name: z.string().min(1).optional(),
    subject: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    variables: z.any().optional(),
});
const templateIdSchema = z.object({
    id: z.string().min(1),
});
const deliveryIdSchema = z.object({
    delivery_id: z.string().min(1),
});
const trackClickSchema = z.object({
    url: z.string().url(),
});
const emailAnalyticsSchema = z.object({
    start_date: z.string().optional(),
    end_date: z.string().optional(),
});
const emailWebhookSchema = z.object({
    provider_message_id: z.string().min(1),
    status: z.string().min(1),
    error_message: z.string().optional(),
});
const sendEmail = async (recipient_email, subject, content) => {
    // TODO: Implement email provider integration
    console.log(`Sending email to ${recipient_email} with subject "${subject}" and content "${content}"`);
    return { success: true, messageId: `msg_${Date.now()}` };
};
// Send individual email
router.post('/send', asyncHandler(async (req, res) => {
    const validationResult = sendEmailSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid email data' });
    }
    const { recipient_id, subject, content, template_id } = validationResult.data;
    // Get recipient details
    const { data: recipient, error: recipientError } = await req.supabase
        .from('patients')
        .select('email, first_name, last_name')
        .eq('id', recipient_id)
        .single();
    if (recipientError) {
        return res.status(500).json({ error: recipientError.message });
    }
    if (!recipient.email) {
        return res.status(400).json({ error: 'Recipient has no email address' });
    }
    try {
        // For now, just record the attempt
        const { data: delivery, error: deliveryError } = await req.supabase
            .from('campaign_deliveries')
            .insert({
            recipient_id,
            status: 'sent',
            metadata: {
                subject,
                content,
                template_id,
                recipient_email: recipient.email
            },
            sent_at: new Date().toISOString()
        })
            .select()
            .single();
        if (deliveryError) {
            throw deliveryError;
        }
        const emailResult = await sendEmail(recipient.email, subject, content);
        return res.json({ ...delivery, emailResult });
    }
    catch (error) {
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to send email'
        });
    }
}));
// Get email templates
router.get('/templates', asyncHandler(async (req, res) => {
    const { data: templates, error } = await req.supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json(templates);
}));
// Create email template
router.post('/templates', asyncHandler(async (req, res) => {
    const validationResult = createTemplateSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid template data' });
    }
    const { name, subject, content, variables } = validationResult.data;
    const { data: template, error } = await req.supabase
        .from('email_templates')
        .insert({
        name,
        subject,
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
// Update email template
router.put('/templates/:id', asyncHandler(async (req, res) => {
    const validationResult = updateTemplateSchema.safeParse(req.body);
    const idValidationResult = templateIdSchema.safeParse(req.params);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid template data' });
    }
    if (!idValidationResult.success) {
        return res.status(400).json({ error: 'Invalid template ID' });
    }
    const { id } = idValidationResult.data;
    const { name, subject, content, variables } = validationResult.data;
    const { data: template, error } = await req.supabase
        .from('email_templates')
        .update({
        name,
        subject,
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
// Delete email template
router.delete('/templates/:id', asyncHandler(async (req, res) => {
    const validationResult = templateIdSchema.safeParse(req.params);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid template ID' });
    }
    const { id } = validationResult.data;
    const { error } = await req.supabase
        .from('email_templates')
        .delete()
        .eq('id', id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(204).send();
}));
// Track email open
router.get('/track/open/:delivery_id', asyncHandler(async (req, res) => {
    const validationResult = deliveryIdSchema.safeParse(req.params);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid delivery ID' });
    }
    const { delivery_id } = validationResult.data;
    // Record email open
    await req.supabase
        .from('campaign_engagements')
        .insert({
        delivery_id,
        type: 'open',
        metadata: {
            user_agent: req.headers['user-agent'],
            ip: req.ip
        }
    });
    // Return tracking pixel
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
}));
// Track email click
router.get('/track/click/:delivery_id', asyncHandler(async (req, res) => {
    const validationResult = deliveryIdSchema.safeParse(req.params);
    const clickValidationResult = trackClickSchema.safeParse(req.query);
    if (!validationResult.success) {
        return res.status(400).json({ error: 'Invalid delivery ID' });
    }
    if (!clickValidationResult.success) {
        return res.status(400).json({ error: 'Invalid click data' });
    }
    const { delivery_id } = validationResult.data;
    const { url } = clickValidationResult.data;
    // Record email click
    await req.supabase
        .from('campaign_engagements')
        .insert({
        delivery_id,
        type: 'click',
        metadata: {
            url,
            user_agent: req.headers['user-agent'],
            ip: req.ip
        }
    });
    // Redirect to original URL
    res.redirect(url);
}));
// Get email analytics
router.get('/analytics', asyncHandler(async (req, res) => {
    const validationResult = emailAnalyticsSchema.safeParse(req.query);
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
        .eq('campaigns.type', 'email')
        .gte('timestamp', start_date)
        .lte('timestamp', end_date)
        .order('timestamp', { ascending: true });
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json(analytics);
}));
// Handle email webhook
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
