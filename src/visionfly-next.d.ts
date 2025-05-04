declare module "visionfly-sdk/next" {
  import { ImageProps } from "next/image";
  import {
    VisionFlyConfig,
    ImageTransformParams,
    SrcSetParams,
  } from "visionfly-sdk";

  export interface VFNextImageProps
    extends Omit<ImageTransformParams, "src">,
      Omit<ImageProps, "src"> {
    src: string;
  }

  export interface VFNextResponsiveImageProps
    extends Omit<SrcSetParams, "src">,
      Omit<ImageProps, "src"> {
    src: string;
    sizes?: string;
  }

  export function VFNextImage(props: VFNextImageProps): JSX.Element;
  export function VFNextResponsiveImage(
    props: VFNextResponsiveImageProps
  ): JSX.Element;
  export function setupVisionFly(
    config: VisionFlyConfig,
    options?: { defaultFormat?: string }
  ): {
    imageLoader: (params: {
      src: string;
      width?: number;
      quality?: number;
    }) => string;
  };
}
