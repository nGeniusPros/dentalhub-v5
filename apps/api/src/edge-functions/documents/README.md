# Document Generation Edge Function

This edge function handles document generation, including PDF and DOCX formats.

## Setup

No specific setup is required for this edge function, but ensure that the API server is properly configured with the necessary environment variables.

## Available Endpoints

### Generate Document
```http
POST /api/edge-functions/documents
```
Generates a document based on the provided data and options.

**Request Body:**
```json
{
  "type": "invoice | receipt | treatment_plan | prescription | referral",
  "templateId": "string",
  "data": {
    // Document data
  },
  "metadata": {
    "patientId": "string",
    "providerId": "string",
    "createdAt": "string",
    "documentId": "string"
  },
  "options": {
    "config": {
      "outputFormat": "pdf | docx",
      "template": "string",
      "paperSize": "A4 | Letter | Legal (optional)",
      "orientation": "portrait | landscape (optional)",
      "margins": {
        "top": number,
        "right": number,
        "bottom": number,
        "left": number
      }
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
    "priority": "high | normal | low (optional)",
    "webhook": {
      "url": "string",
      "secret": "string"
    }
  }
}
```

### Get Document Template
```http
GET /api/edge-functions/documents/templates/:templateId
```
Retrieves a document template by its ID.

## Features

- PDF and DOCX generation
- Customizable templates
- Document storage options
- Webhook support
- Priority queue management

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
- Storage settings
- Webhook settings
- Priority queue settings

## Development

### Running Tests
```bash
pnpm test:documents
```

### Adding New Features
1. Define types in `types.ts`
2. Implement service method in `service.ts`
3. Add route in `index.ts`
4. Update documentation

## Monitoring

The edge function includes built-in monitoring for:
- Generation success rates
- Processing times
- Error rates
- Resource utilization

## Security

Security measures include:
- Request validation
- Secure error handling
- Access control