# Retell.ai Integration

This integration handles voice calls, transcription, and AI analysis through the Retell.ai API.

## Setup

1. Copy `.env.example` to `.env` in the api directory
2. Fill in the required Retell API credentials:
   - `RETELL_API_URL`
   - `RETELL_API_KEY`
   - `RETELL_WEBHOOK_SECRET`

## Available Endpoints

### Initiate Voice Call

```http
POST /api/retell/calls
```

Initiates a voice call to a patient.

**Request Body:**

```json
{
  "patientId": "string",
  "phoneNumber": "string",
  "purpose": "appointment_reminder | follow_up | billing | custom",
  "customScript": "string (optional)",
  "language": "string (optional)",
  "priority": "high | normal | low (optional)"
}
```

### Get Call Status

```http
GET /api/retell/calls/:callId
```

Retrieves the status of a specific call.

### Get Call Transcription

```http
GET /api/retell/calls/:callId/transcription
```

Retrieves the transcription of a completed call.

### Get Call Analysis

```http
GET /api/retell/calls/:callId/analysis
```

Retrieves the AI analysis of a completed call.

### Cancel Call

```http
POST /api/retell/calls/:callId/cancel
```

Cancels an ongoing or queued call.

### Update Call Priority

```http
PATCH /api/retell/calls/:callId
```

Updates the priority of a queued call.

**Request Body:**

```json
{
  "priority": "high | normal | low"
}
```

### Get Recording URL

```http
GET /api/retell/calls/:callId/recording
```

Retrieves the URL for the call recording.

### Webhook Endpoint

```http
POST /api/retell/webhook
```

Receives webhooks from Retell.ai for call events.

## Features

### Voice Calls

- Automated outbound calls
- Multiple call purposes
- Custom scripts support
- Priority queue management
- Call recording

### Transcription

- Real-time transcription
- Speaker diarization
- Confidence scores
- Segment timestamps

### AI Analysis

- Sentiment analysis
- Intent detection
- Entity extraction
- Call summarization
- Action item identification

## Error Handling

The integration includes comprehensive error handling with:

- Automatic retries for transient failures
- Rate limiting protection
- Detailed error responses
- Webhook signature validation

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

- Call settings (duration, recording, etc.)
- Queue management
- Analysis parameters
- Webhook handling

See `.env.example` for all available configuration options.

## Development

### Running Tests

```bash
pnpm test:retell
```

### Adding New Features

1. Define types in `types.ts`
2. Add validation in `validators.ts`
3. Implement service method in `service.ts`
4. Add route in `index.ts`
5. Update documentation

## Monitoring

The integration includes built-in monitoring for:

- Call success rates
- Transcription accuracy
- Analysis performance
- API response times
- Queue metrics

## Security

Security measures include:

- Webhook signature validation
- API key management
- Rate limiting
- Secure error handling
- PII protection

## Best Practices

1. Always test calls with a development API key first
2. Monitor call durations and costs
3. Handle webhook events reliably
4. Store sensitive data securely
5. Implement proper error recovery
6. Use appropriate call priorities
7. Monitor queue performance
