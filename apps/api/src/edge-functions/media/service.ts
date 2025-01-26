import { handleMediaError } from "./error";
import { v4 as uuidv4 } from "uuid";
import { mediaConfig } from "./config";
import { promises as fs } from "fs";
import path from "path";
import type {
  ImageProcessingOptions,
  MediaData,
  MediaOptions,
  ProcessedMedia,
  MediaProcessingResult,
  MediaStorageOptions,
} from "./types";
import { edgeCache } from "../../utils/cache";
import { MonitoringService } from "../../services/monitoring";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";

const instances = process.env.EDGE_INSTANCES
  ? parseInt(process.env.EDGE_INSTANCES)
  : 1;
let currentInstance = 0;

async function processImage(
  url: string,
  options: ImageProcessingOptions,
): Promise<Buffer> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let image = sharp(buffer);

    if (options.width || options.height) {
      image = image.resize(options.width, options.height, {
        fit: options.fit || "cover",
        position: options.position || "center",
      });
    }

    if (options.resize) {
      image = image.resize(options.resize.width, options.resize.height, {
        fit: options.resize.fit || "cover",
      });
    }

    if (options.crop) {
      image = image.extract({
        left: options.crop.x,
        top: options.crop.y,
        width: options.crop.width,
        height: options.crop.height,
      });
    }

    if (options.rotate) {
      image = image.rotate(options.rotate);
    }

    if (options.effect) {
      switch (options.effect) {
        case "grayscale":
          image = image.grayscale();
          break;
        case "sepia":
          image = image.tint({ r: 112, g: 66, b: 20 });
          break;
        case "blur":
          image = image.blur(10);
          break;
      }
    }

    return image
      .toFormat(options.format || "jpeg", {
        quality: options.quality || 80,
        progressive: options.progressive || true,
      })
      .toBuffer();
  } catch (error) {
    throw handleMediaError(error, "IMAGE_PROCESSING_FAILED");
  }
}

async function processVideo(url: string): Promise<Buffer> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("No video data received");
    }

    const chunks: Buffer[] = [];
    const reader = response.body.getReader();

    return new Promise((resolve, reject) => {
      const stream = new Readable({
        async read() {
          try {
            const { done, value } = await reader.read();
            if (done) {
              this.push(null);
              return;
            }
            this.push(value);
          } catch (error: unknown) {
            if (error instanceof Error) {
              this.destroy(error);
            } else {
              this.destroy(new Error(String(error)));
            }
          }
        },
      });

      ffmpeg(stream)
        .outputFormat("mp4")
        .videoCodec("libx264")
        .audioCodec("aac")
        .on("error", (err) => {
          reject(handleMediaError(err, "VIDEO_PROCESSING_FAILED"));
        })
        .on("end", () => {
          resolve(Buffer.concat(chunks));
        })
        .pipe()
        .on("data", (chunk) => {
          chunks.push(chunk);
        });
    });
  } catch (error) {
    throw handleMediaError(error, "VIDEO_PROCESSING_FAILED");
  }
}

async function storeMedia(
  buffer: Buffer,
  options: MediaStorageOptions,
): Promise<string> {
  try {
    // Mock implementation for storing media
    const mediaId = uuidv4();
    const filePath = path.join(
      options.path,
      `${mediaId}.${options.path.split(".").pop()}`,
    );
    await fs.writeFile(filePath, buffer);
    return `file://${filePath}`;
  } catch (error) {
    throw handleMediaError(error, "MEDIA_STORAGE_FAILED");
  }
}

export async function processMedia(
  data: MediaData,
  options: MediaOptions,
): Promise<MediaProcessingResult> {
  const cacheKey = `media-${JSON.stringify(data)}-${JSON.stringify(options)}`;
  const start = Date.now();
  return edgeCache.get(cacheKey, async () => {
    try {
      const mediaId = uuidv4();
      const config = options.config || {
        imageProvider: "cloudinary",
      };

      let buffer: Buffer;
      if (data.type === "image") {
        buffer = await processImage(data.url, data.options || {});
      } else if (data.type === "video") {
        buffer = await processVideo(data.url);
      } else {
        throw handleMediaError(
          new Error(`Unsupported media type: ${data.type}`),
          "UNSUPPORTED_MEDIA_TYPE",
        );
      }

      let url: string = "";
      if (options.storage) {
        url = await storeMedia(buffer, {
          ...options.storage,
          path: options.storage.path || "media",
        });
      }

      const media: ProcessedMedia = {
        mediaId,
        url,
        type: data.type,
        format: data.type === "image" ? data.options?.format || "jpeg" : "mp4",
        size: buffer.length,
        createdAt: new Date().toISOString(),
        metadata: data.metadata,
      };

      MonitoringService.logEdgeFunction(
        "processMedia",
        "success",
        Date.now() - start,
      );

      return {
        success: true,
        media,
      };
    } catch (error) {
      MonitoringService.logEdgeFunction(
        "processMedia",
        "error",
        Date.now() - start,
      );
      return {
        success: false,
        error: handleMediaError(error, "MEDIA_PROCESSING_FAILED"),
      };
    }
  });
}
