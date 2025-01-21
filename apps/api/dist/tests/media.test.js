import { processMedia } from '../edge-functions/media/service';
describe('Media Processing', () => {
    it('should process an image successfully', async () => {
        const data = {
            type: 'image',
            url: 'https://example.com/image.jpg',
        };
        const options = {};
        const result = await processMedia(data, options);
        expect(result.success).toBe(true);
        expect(result.media).toBeDefined();
        expect(result.media?.type).toBe('image');
    });
    it('should process a video successfully', async () => {
        const data = {
            type: 'video',
            url: 'https://example.com/video.mp4',
        };
        const options = {};
        const result = await processMedia(data, options);
        expect(result.success).toBe(true);
        expect(result.media).toBeDefined();
        expect(result.media?.type).toBe('video');
    });
    it('should handle an unsupported media type', async () => {
        const data = {
            type: 'audio',
            url: 'https://example.com/audio.mp3',
        };
        const options = {};
        const result = await processMedia(data, options);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error?.code).toBe('UNSUPPORTED_MEDIA_TYPE');
    });
    it('should handle image processing errors', async () => {
        const data = {
            type: 'image',
            url: 'invalid-url',
        };
        const options = {};
        const result = await processMedia(data, options);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error?.code).toBe('IMAGE_PROCESSING_FAILED');
    });
});
