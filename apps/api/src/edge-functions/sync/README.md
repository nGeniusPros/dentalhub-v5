# Calendar and Contacts Sync Edge Function

This edge function handles calendar and contacts synchronization.

## Setup

1. Copy `.env.example` to `.env` in the api directory
2. Fill in the required sync provider credentials:
   - `CALENDAR_PROVIDER` (google, microsoft, ical)
   - `CONTACTS_PROVIDER` (google, microsoft, vcard)
   - `CALENDAR_API_KEY` (if using google or microsoft)
   - `CONTACTS_API_KEY` (if using google or microsoft)
   - `CALENDAR_ID` (if using google or microsoft)
   - `CONTACTS_LIST_ID` (if using google or microsoft)

## Available Endpoints

### Synchronize Calendar or Contacts
```http
POST /api/edge-functions/sync
```
Synchronizes calendar or contacts based on the provided data and options.

**Request Body:**
```json
{
  "type": "calendar | contacts",
  "options": {
    // Calendar options
    "syncDirection": "one-way | two-way",
    "syncInterval": number,
    "timeZone": "string (optional)",
    "eventFilters": {
      "startAfter": "string (optional)",
      "endBefore": "string (optional)",
      "attendees": ["string"] (optional)
    },
    // Contacts options
    "syncDirection": "one-way | two-way",
    "syncInterval": number,
    "contactFilters": {
      "groups": ["string"] (optional),
      "updatedAfter": "string (optional)"
    }
  },
  "metadata": {
    "patientId": "string (optional)",
    "providerId": "string (optional)",
    "createdAt": "string (optional)",
    "syncId": "string (optional)"
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
      "calendarProvider": "google | microsoft | ical",
      "contactsProvider": "google | microsoft | vcard"
    }
  }
}
```

## Features

- Calendar and contacts synchronization
- Multiple provider support
- One-way and two-way sync
- Configurable sync intervals
- Event and contact filtering
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
- Calendar provider settings
- Contacts provider settings
- Webhook settings
- Priority queue settings

See `.env.example` for all available configuration options.

## Development

### Running Tests
```bash
pnpm test:sync
```

### Adding New Features
1. Define types in `types.ts`
2. Implement service method in `service.ts`
3. Add route in `index.ts`
4. Update documentation

## Monitoring

The edge function includes built-in monitoring for:
- Sync success rates
- Processing times
- Error rates
- Resource utilization

## Security

Security measures include:
- Request validation
- Secure error handling
- Access control