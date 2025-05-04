declare module "visionfly-sdk" {
  export interface VisionFlyConfig {
    apiKey: string;
    apiSecret: string;
    baseUrl?: string;
    cdnUrl?: string;
  }

  export interface ImageTransformParams {
    src: string;
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "webp" | "avif" | "jpeg" | "png";
    blur?: number;
    sharpen?: number;
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hue?: number;
  }

  export interface SrcSetParams {
    src: string;
    widths?: number[] | string;
    format?: string;
    quality?: number;
  }

  export interface SrcSetData {
    default: string;
    srcset: string;
    sizes: string;
  }

  export class VisionFly {
    constructor(config: VisionFlyConfig);
    getImageUrl(params: ImageTransformParams): Promise<string>;
    getSrcSet(params: SrcSetParams): Promise<SrcSetData>;
    clearCache(): void;
  }
}
