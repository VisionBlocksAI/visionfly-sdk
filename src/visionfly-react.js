import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import VisionFly from "./visionfly-core";

// Create VisionFly context
const VisionFlyContext = createContext(null);

/**
 * VisionFly Provider component
 * @param {Object} props - Component props
 * @param {Object} props.config - VisionFly configuration
 * @param {React.ReactNode} props.children - Child components
 */
export function VisionFlyProvider({ config, children }) {
  const [client] = useState(() => new VisionFly(config));
  const [ready, setReady] = useState(false);

  // Initialize the client
  useEffect(() => {
    const init = async () => {
      try {
        // Trigger authentication
        await client._ensureAuthenticated();
        setReady(true);
      } catch (error) {
        console.error("Failed to initialize VisionFly client:", error);
      }
    };

    init();
  }, [client]);

  // Context value
  const contextValue = {
    client,
    ready,
  };

  return (
    <VisionFlyContext.Provider value={contextValue}>
      {children}
    </VisionFlyContext.Provider>
  );
}

/**
 * Hook to access VisionFly client
 * @returns {Object} VisionFly context
 */
export function useVisionFly() {
  const context = useContext(VisionFlyContext);

  if (!context) {
    throw new Error("useVisionFly must be used within a VisionFlyProvider");
  }

  return context;
}

/**
 * Image component with optimization
 * @param {Object} props - Component props
 */
export function VFImage({
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
  className = "",
  style = {},
  loading = "lazy",
  ...restProps
}) {
  const { client, ready } = useVisionFly();
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get optimized image URL
  useEffect(() => {
    if (!ready || !src) return;

    let isMounted = true;
    setIsLoading(true);

    const loadImage = async () => {
      try {
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

        if (isMounted) {
          setImageUrl(url);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load image:", err);
          setError(err);
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
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
  ]);

  // Placeholder while loading
  if (isLoading) {
    return (
      <div
        className={`vf-image-placeholder ${className}`}
        style={{
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "auto",
          backgroundColor: "#f0f0f0",
          ...style,
        }}
        {...restProps}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`vf-image-error ${className}`}
        style={{
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "auto",
          backgroundColor: "#ff5555",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          ...style,
        }}
        {...restProps}
      >
        Error loading image
      </div>
    );
  }

  // Render optimized image
  return (
    <img
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={`vf-image ${className}`}
      style={style}
      {...restProps}
    />
  );
}

/**
 * Responsive image component with srcset
 * @param {Object} props - Component props
 */
export function VFResponsiveImage({
  src,
  widths,
  sizes,
  quality,
  format,
  alt = "",
  className = "",
  style = {},
  loading = "lazy",
  ...restProps
}) {
  const { client, ready } = useVisionFly();
  const [srcsetData, setSrcsetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get srcset data
  useEffect(() => {
    if (!ready || !src) return;

    let isMounted = true;
    setIsLoading(true);

    const loadSrcset = async () => {
      try {
        const data = await client.getSrcSet({
          src,
          widths,
          format,
          quality,
        });

        if (isMounted) {
          setSrcsetData(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load srcset:", err);
          setError(err);
          setIsLoading(false);
        }
      }
    };

    loadSrcset();

    return () => {
      isMounted = false;
    };
  }, [
    client,
    ready,
    src,
    widths && JSON.stringify(widths),
    sizes,
    quality,
    format,
  ]);

  // Placeholder while loading
  if (isLoading) {
    return (
      <div
        className={`vf-image-placeholder ${className}`}
        style={{
          width: "100%",
          height: "300px",
          backgroundColor: "#f0f0f0",
          ...style,
        }}
        {...restProps}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`vf-image-error ${className}`}
        style={{
          width: "100%",
          height: "300px",
          backgroundColor: "#ff5555",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          ...style,
        }}
        {...restProps}
      >
        Error loading image
      </div>
    );
  }

  // Render responsive image
  return (
    <img
      src={srcsetData.default}
      srcSet={srcsetData.srcset}
      sizes={sizes || srcsetData.sizes}
      alt={alt}
      loading={loading}
      className={`vf-responsive-image ${className}`}
      style={style}
      {...restProps}
    />
  );
}

/**
 * Image uploader component
 * @param {Object} props - Component props
 */
export function VFUploader({
  projectId,
  onUpload,
  onError,
  publicId,
  multiple = false,
  className = "",
  style = {},
  buttonClassName = "",
  buttonStyle = {},
  buttonText = "Upload Image",
  children,
  ...restProps
}) {
  const { client, ready } = useVisionFly();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = useCallback(
    async (event) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setIsUploading(true);

      try {
        // Handle multiple files
        if (multiple) {
          const results = await Promise.all(
            Array.from(files).map((file) =>
              client.uploadImage({
                file,
                projectId,
                publicId: publicId || undefined,
              })
            )
          );

          setIsUploading(false);
          if (onUpload) onUpload(results);
        }
        // Handle single file
        else {
          const result = await client.uploadImage({
            file: files[0],
            projectId,
            publicId: publicId || undefined,
          });

          setIsUploading(false);
          if (onUpload) onUpload(result);
        }

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (err) {
        setIsUploading(false);
        console.error("Upload failed:", err);
        if (onError) onError(err);
      }
    },
    [client, projectId, publicId, multiple, onUpload, onError]
  );

  // Custom button or default
  const uploadButton = children || (
    <button
      type="button"
      className={`vf-upload-button ${buttonClassName}`}
      style={buttonStyle}
      disabled={isUploading || !ready}
    >
      {isUploading ? "Uploading..." : buttonText}
    </button>
  );

  return (
    <div className={`vf-uploader ${className}`} style={style} {...restProps}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="vf-file-input"
      />
      <label htmlFor="vf-file-input">{uploadButton}</label>
    </div>
  );
}

// Export everything
export default {
  VisionFlyProvider,
  useVisionFly,
  VFImage,
  VFResponsiveImage,
  VFUploader,
};
