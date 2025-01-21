# Sikka Integration

This integration handles insurance verification, eligibility checks, benefits verification, and claims processing through the Sikka API.

## Setup

1. Copy `.env.example` to `.env` in the api directory
2. Fill in the required Sikka API credentials:
   - `SIKKA_API_URL`
   - `SIKKA_API_KEY`
   - `SIKKA_PRACTICE_ID`

## Available Endpoints

### Insurance Verification
```http
POST /api/sikka/verify
```
Verifies insurance information for a patient.

**Request Body:**
```json
{
  "patientId": "string",
  "insuranceInfo": {
    "carrierId": "string",
    "memberId": "string",
    "groupNumber": "string" // optional
  }
}
```

### Eligibility Check
```http
POST /api/sikka/eligibility
```
Checks service eligibility for a patient.

**Request Body:**
```json
{
  "patientId": "string",
  "serviceDate": "YYYY-MM-DD",
  "serviceTypes": ["string"]
}
```

### Benefits Verification
```http
POST /api/sikka/benefits
```
Verifies benefits coverage for specific procedures.

**Request Body:**
```json
{
  "patientId": "string",
  "procedureCodes": ["string"],
  "serviceDate": "YYYY-MM-DD"
}
```

### Claims Processing
```http
POST /api/sikka/claims
```
Submits an insurance claim.

**Request Body:**
```json
{
  "patientId": "string",
  "claimDetails": {
    "serviceDate": "YYYY-MM-DD",
    "procedures": [
      {
        "code": "string",
        "fee": number,
        "diagnosis": ["string"]
      }
    ],
    "diagnosisCodes": ["string"],
    "placeOfService": "string"
  }
}
```

## Error Handling

The integration includes comprehensive error handling with:
- Automatic retries for transient failures
- Rate limiting protection
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
- Request timeouts
- Retry settings
- Rate limiting
- Cache settings

See `.env.example` for all available configuration options.

## Development

### Running Tests
```bash
pnpm test:sikka
```

### Adding New Endpoints
1. Define types in `types.ts`
2. Add validation in `validators.ts`
3. Implement service method in `service.ts`
4. Add route in `index.ts`
5. Update documentation

## Monitoring

The integration includes built-in monitoring for:
- Response times
- Error rates
- API usage patterns
- Cache hit rates

## Security

Security measures include:
- Request validation
- Rate limiting
- API key management
- Secure error handling