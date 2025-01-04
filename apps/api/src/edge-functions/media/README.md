# Media Processing Edge Function

This edge function handles image and video processing.

## Setup

1. Copy `.env.example` to `.env` in the api directory
2. Fill in the required media provider credentials:
   - `IMAGE_PROVIDER` (cloudinary, imgix, s3)
   - `IMAGE_API_KEY` (if using cloudinary or imgix)
   - `IMAGE_API_SECRET` (if using cloudinary or imgix)
   - `IMAGE_CLOUD_NAME` (if using cloudinary)
   - `IMAGE_BUCKET_NAME` (if using s3)
   - `IMAGE_REGION` (if using s3)

## Available Endpoints

### Process Media
```http
POST /api/edge-functions/media
```
Processes an image or video based on the provided data and options.

**Request Body:**
```json
{
  "type": "image | video",
  "url": "string",
  "options": {
    "resize": {
      "width": number,
      "height": number,
      "fit": "cover | contain | fill (optional)"
    },
    "crop": {
      "x": number,
      "y": number,
      "width": number,
      "height": number
    },
    "rotate": number,
    "format": "jpeg | png | webp (optional)",
    "quality": number,
    "effect": "grayscale | sepia | blur (optional)"
  },
  "metadata": {
    "patientId": "string (optional)",
    "providerId": "string (optional)",
    "createdAt": "string (optional)",
    "mediaId": "string (optional)"
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
      "imageProvider": "cloudinary | imgix | s3"
    }
  }
}
```

## Features

- Image and video processing
- Multiple provider support
- Image resizing, cropping, rotation, formatting, and effects
- Video processing
- Media storage options
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
- Media provider settings
- Webhook settings
- Priority queue settings

See `.env.example` for all available configuration options.

## Development

### Running Tests
```bash
pnpm test:media
```

### Adding New Features
1. Define types in `types.ts`
2. Implement service method in `service.ts`
3. Add route in `index.ts`
4. Update documentation

## Monitoring

The edge function includes built-in monitoring for:
- Processing success rates
- Processing times
- Error rates
- Resource utilization

## Security

Security measures include:
- Request validation
- Secure error handling
- Access control