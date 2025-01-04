import { processMedia } from '../edge-functions/media/service';
import { MediaData, MediaOptions } from '../edge-functions/media/types';

describe('Media Processing', () => {
  it('should process an image successfully', async () => {
    const data: MediaData = {
      type: 'image',
      url: 'https://example.com/image.jpg',
    };
    const options: MediaOptions = {};
    const result = await processMedia(data, options);
    expect(result.success).toBe(true);
    expect(result.media).toBeDefined();
    expect(result.media?.type).toBe('image');
  });

  it('should process a video successfully', async () => {
    const data: MediaData = {
      type: 'video',
      url: 'https://example.com/video.mp4',
    };
    const options: MediaOptions = {};
    const result = await processMedia(data, options);
    expect(result.success).toBe(true);
    expect(result.media).toBeDefined();
    expect(result.media?.type).toBe('video');
  });

  it('should handle an unsupported media type', async () => {
    const data: MediaData = {
      type: 'audio' as any,
      url: 'https://example.com/audio.mp3',
    };
    const options: MediaOptions = {};
    const result = await processMedia(data, options);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('UNSUPPORTED_MEDIA_TYPE');
  });

  it('should handle image processing errors', async () => {
    const data: MediaData = {
      type: 'image',
      url: 'invalid-url',
    };
    const options: MediaOptions = {};
    const result = await processMedia(data, options);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('IMAGE_PROCESSING_FAILED');
  });
});