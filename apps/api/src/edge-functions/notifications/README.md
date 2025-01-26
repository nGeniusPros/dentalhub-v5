# Notifications Edge Function

This edge function handles sending email and SMS notifications.

## Setup

1. Copy `.env.example` to `.env` in the api directory
2. Fill in the required notification provider credentials:
   - `EMAIL_PROVIDER` (sendgrid, mailgun, smtp)
   - `SMS_PROVIDER` (twilio, nexmo, plivo)
   - `EMAIL_API_KEY` (if using sendgrid or mailgun)
   - `SMS_API_KEY` (if using twilio, nexmo, or plivo)
   - `EMAIL_DOMAIN` (if using mailgun)
   - `SMS_FROM_NUMBER` (if using twilio, nexmo, or plivo)
   - SMTP settings if using SMTP

## Available Endpoints

### Send Notification

```http
POST /api/edge-functions/notifications
```

Sends an email or SMS notification.

**Request Body:**

```json
{
  "type": "email | sms",
  "options": {
    // Email options
    "to": "string | string[]",
    "from": "string (optional)",
    "subject": "string",
    "text": "string (optional)",
    "html": "string (optional)",
    "templateId": "string (optional)",
    "dynamicTemplateData": {} // optional
    // SMS options
    "to": "string | string[]",
    "from": "string (optional)",
    "text": "string"
  },
  "metadata": {
    "patientId": "string (optional)",
    "providerId": "string (optional)",
    "createdAt": "string (optional)",
    "notificationId": "string (optional)"
  },
  "options": {
    "priority": "high | normal | low (optional)",
    "webhook": {
      "url": "string",
      "secret": "string"
    },
    "storage": {
      "bucket": "string",
      "path": "string",
      "acl": "private | public-read (optional)",
      "metadata": {
        // Storage metadata
      },
      "expiresIn": number // optional
    },
    "config": {
      "emailProvider": "sendgrid | mailgun | smtp",
      "smsProvider": "twilio | nexmo | plivo"
    }
  }
}
```

## Features

- Email and SMS notifications
- Multiple provider support
- Template support for emails
- Priority queue management
- Webhook support

## Error Handling

The edge function includes comprehensive error handling with:

- Detailed error responses
- Logging for debugging

### Error Response Format

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {} // optional
  }
}
```

## Configuration

Key configuration options can be adjusted through environment variables:

- Email provider settings
- SMS provider settings
- Webhook settings
- Priority queue settings

See `.env.example` for all available configuration options.

## Development

### Running Tests

```bash
pnpm test:notifications
```

### Adding New Features

1. Define types in `types.ts`
2. Implement service method in `service.ts`
3. Add route in `index.ts`
4. Update documentation

## Monitoring

The edge function includes built-in monitoring for:

- Notification success rates
- Processing times
- Error rates
- Resource utilization

## Security

Security measures include:

- Request validation
- Secure error handling
- Access control
