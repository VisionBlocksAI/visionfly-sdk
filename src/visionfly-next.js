import { useState, useEffect } from "react";
import Image from "next/image";
import { useVisionFly } from "./visionfly-react";

/**
 * VisionFly enhanced Next.js Image component
 * @param {Object} props - Component props
 */
export function VFNextImage({
  src,
  width,
  height,
  quality,
  format,
  blur,
  sharpen,
  brightness,
  contrast,
  saturation,
  hue,
  alt = "",
  placeholder = "blur",
  ...restProps
}) {
  const { client, ready } = useVisionFly();
  const [imageUrl, setImageUrl] = useState("");
  const [blurDataUrl, setBlurDataUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Generate tiny preview for blur placeholder
  useEffect(() => {
    if (!ready || !src) return;

    const loadImage = async () => {
      try {
        // Get optimized image URL
        const url = await client.getImageUrl({
          src,
          width,
          height,
          quality,
          format,
          blur,
          sharpen,
          brightness,
          contrast,
          saturation,
          hue,
        });

        setImageUrl(url);

        // Generate a tiny preview for blur placeholder if needed
        if (placeholder === "blur") {
          const tinyUrl = await client.getImageUrl({
            src,
            width: 20, // Very small for data URL
            quality: 20,
            format: "webp",
            blur: 10,
          });

          // Fetch the tiny image and convert to base64
          const response = await fetch(tinyUrl);
          const buffer = await response.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          const dataUrl = `data:image/webp;base64,${base64}`;

          setBlurDataUrl(dataUrl);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load image:", err);
        setIsLoading(false);
      }
    };

    loadImage();
  }, [
    client,
    ready,
    src,
    width,
    height,
    quality,
    format,
    blur,
    sharpen,
    brightness,
    contrast,
    saturation,
    hue,
    placeholder,
  ]);

  if (isLoading || !imageUrl) {
    return (
      <div
        style={{
          width: width || "100%",
          height: height || "300px",
          backgroundColor: "#f0f0f0",
        }}
      />
    );
  }

  // Use Next.js Image component with our optimized URL
  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      blurDataURL={blurDataUrl}
      placeholder={placeholder}
      {...restProps}
    />
  );
}

/**
 * VisionFly enhanced Next.js responsive Image component
 * @param {Object} props - Component props
 */
export function VFNextResponsiveImage({
  src,
  widths,
  sizes,
  quality,
  format,
  fill = true,
  alt = "",
  placeholder = "blur",
  ...restProps
}) {
  const { client, ready } = useVisionFly();
  const [srcsetData, setSrcsetData] = useState(null);
  const [blurDataUrl, setBlurDataUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Generate srcset and blur placeholder
  useEffect(() => {
    if (!ready || !src) return;

    const loadSrcset = async () => {
      try {
        const data = await client.getSrcSet({
          src,
          widths,
          format,
          quality,
        });

        setSrcsetData(data);

        // Generate a tiny preview for blur placeholder if needed
        if (placeholder === "blur") {
          const tinyUrl = await client.getImageUrl({
            src,
            width: 20,
            quality: 20,
            format: "webp",
            blur: 10,
          });

          // Fetch the tiny image and convert to base64
          const response = await fetch(tinyUrl);
          const buffer = await response.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          const dataUrl = `data:image/webp;base64,${base64}`;

          setBlurDataUrl(dataUrl);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load srcset:", err);
        setIsLoading(false);
      }
    };

    loadSrcset();
  }, [
    client,
    ready,
    src,
    widths && JSON.stringify(widths),
    quality,
    format,
    placeholder,
  ]);

  if (isLoading || !srcsetData) {
    return (
      <div
        style={{
          position: fill ? "relative" : "static",
          width: "100%",
          height: fill ? "100%" : "300px",
          backgroundColor: "#f0f0f0",
        }}
      />
    );
  }

  // For Next.js Image, we use imageSizes, deviceSizes, and loader
  return (
    <Image
      src={srcsetData.default}
      alt={alt}
      blurDataURL={blurDataUrl}
      placeholder={placeholder}
      fill={fill}
      sizes={sizes || srcsetData.sizes}
      loader={({ src, width }) => {
        // Parse the URL to extract the parameters
        const url = new URL(src);
        const params = Object.fromEntries(url.searchParams.entries());

        // Override the width if provided
        if (width) {
          params.w = width;
        }

        // Rebuild the URL with the new width
        const newParams = new URLSearchParams(params);
        return `${url.origin}${url.pathname}?${newParams.toString()}`;
      }}
      {...restProps}
    />
  );
}

/**
 * Setup VisionFly for Next.js app
 * @param {Object} config - VisionFly configuration
 * @param {Object} options - Additional options
 * @returns {Object} Next.js loader and other utilities
 */
export function setupVisionFly(config, options = {}) {
  // Create loader function for Next.js Image
  const imageLoader = ({ src, width, quality }) => {
    // If src is already a VisionFly URL, just use it
    if (src.includes(config.baseUrl || "api.visionfly.ai")) {
      return src;
    }

    // Otherwise, construct a VisionFly URL
    const baseUrl = config.baseUrl || "https://api.visionfly.ai";

    // Create a URL with the necessary parameters
    const params = new URLSearchParams({
      src,
      w: width || "",
      q: quality || 80,
      f: options.defaultFormat || "auto",
    });

    return `${baseUrl}/transform?${params.toString()}`;
  };

  // Return utilities
  return {
    imageLoader,
    // Additional utility functions could be added here
  };
}
