declare module "visionfly-sdk/react" {
  import { ReactNode } from "react";
  import {
    VisionFlyConfig,
    ImageTransformParams,
    SrcSetParams,
  } from "visionfly-sdk";

  export interface VisionFlyProviderProps {
    config: VisionFlyConfig;
    children: ReactNode;
  }

  export interface VFImageProps extends Omit<ImageTransformParams, "src"> {
    src: string;
    alt?: string;
    className?: string;
    style?: React.CSSProperties;
  }

  export interface VFResponsiveImageProps extends Omit<SrcSetParams, "src"> {
    src: string;
    sizes?: string;
    alt?: string;
    className?: string;
    style?: React.CSSProperties;
  }

  export function VisionFlyProvider(props: VisionFlyProviderProps): JSX.Element;
  export function useVisionFly(): { client: any; ready: boolean };
  export function VFImage(props: VFImageProps): JSX.Element;
  export function VFResponsiveImage(props: VFResponsiveImageProps): JSX.Element;
}
