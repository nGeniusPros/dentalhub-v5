export interface MediaConfig {
  imageProvider: "cloudinary" | "imgix" | "s3";
  apiKey?: string;
  apiSecret?: string;
  cloudName?: string;
  bucketName?: string;
  region?: string;
}

export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  position?:
    | "center"
    | "top"
    | "right top"
    | "right"
    | "right bottom"
    | "bottom"
    | "left bottom"
    | "left"
    | "left top";
  format?: "jpeg" | "png" | "webp" | "tiff" | "raw";
  quality?: number;
  progressive?: boolean;
  resize?: {
    width: number;
    height: number;
    fit?: "cover" | "contain" | "fill";
  };
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rotate?: number;
  effect?: "grayscale" | "sepia" | "blur";
}

export interface MediaData {
  type: "image" | "video";
  url: string;
  options?: ImageProcessingOptions;
  metadata?: {
    patientId?: string;
    providerId?: string;
    createdAt?: string;
    mediaId?: string;
  };
}

export interface ProcessedMedia {
  mediaId: string;
  url: string;
  type: string;
  format: string;
  size: number;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface MediaProcessingError {
  code: string;
  message: string;
  details?: any;
}

export interface MediaProcessingResult {
  success: boolean;
  media?: ProcessedMedia;
  error?: MediaProcessingError;
}

export interface MediaStorageOptions {
  bucket: string;
  path: string;
  acl?: "private" | "public-read";
  metadata?: Record<string, string>;
  expiresIn?: number;
}

export interface MediaOptions {
  priority?: "high" | "normal" | "low";
  webhook?: {
    url: string;
    secret: string;
  };
  storage?: MediaStorageOptions;
  config?: MediaConfig;
}
