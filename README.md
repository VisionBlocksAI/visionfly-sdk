# VisionFly SDK

Official SDK for VisionFly Image API - Image optimization, transformation, and delivery.

## Installation

```bash
npm install visionfly-sdk
```

## Quick Start

```javascript
import { VisionFly } from "visionfly-sdk";

// Initialize the SDK
const visionfly = new VisionFly({
  apiKey: "your-api-key",
  apiSecret: "your-api-secret",
});

// Upload an image
const result = await visionfly.uploadImage({
  file: imageFile,
  publicId: "optional-custom-id", // optional
});

// The result will contain a CDN URL like: cdn.visionfly.ai/user_id/image-name.jpg
const imageUrl = result.public_url;

// Now you can use this URL for transformations
const transformedUrl = await visionfly.transformImage({
  src: imageUrl, // Must be a VisionFly CDN URL
  width: 800,
  height: 600,
});
```

## Core Features

- Image upload with automatic optimization
- Image transformation (resize, format conversion, effects)
- Responsive image generation with srcset
- Automatic authentication and token management

## Usage Examples

### 1. Image Upload

```javascript
// Basic upload
const result = await visionfly.uploadImage({
  file: imageFile,
});

// Upload with custom ID
const result = await visionfly.uploadImage({
  file: imageFile,
  publicId: "my-custom-image-name",
});

// The result will contain a CDN URL like: cdn.visionfly.ai/user_id/image-name.jpg
console.log(result.public_url);
```

### 2. Image Transformation

```javascript
// Get an optimized image URL
// Note: src must be a VisionFly CDN URL (from upload)
const imageUrl = await visionfly.transformImage({
  src: "cdn.visionfly.ai/user_id/image-name.jpg", // Must be a VisionFly CDN URL
  width: 800,
  height: 600,
  quality: 85,
  format: "webp",
  blur: 5,
  sharpen: 10,
  brightness: 10,
  contrast: 15,
  saturation: -10,
  hue: 30,
});
```

### 3. Responsive Images

```javascript
// Generate a responsive srcset
// Note: src must be a VisionFly CDN URL (from upload)
const srcsetData = await visionfly.getSrcSet({
  src: "cdn.visionfly.ai/user_id/image-name.jpg", // Must be a VisionFly CDN URL
  widths: [400, 800, 1200], // Optional: Array of widths or comma-separated string
  format: "webp", // Optional: Output format (auto, webp, avif, jpeg, png)
  quality: 80, // Optional: Image quality (1-100)
});

// The result contains:
// - srcset: String of responsive image URLs with width descriptors
// - sizes: Recommended sizes attribute
// - default: Default image URL for the src attribute

// Use in HTML
<img
  src={srcsetData.default}
  srcSet={srcsetData.srcset}
  sizes={srcsetData.sizes}
  alt="Responsive image"
/>;
```

### 4. Framework Examples

#### HTML

```html
<!-- Basic responsive image -->
<img
  src="cdn.visionfly.ai/user_id/image-name.jpg"
  srcset="
    https://api.visionfly.ai/transform?src=cdn.visionfly.ai/user_id/image-name.jpg&w=400&f=webp&q=80   400w,
    https://api.visionfly.ai/transform?src=cdn.visionfly.ai/user_id/image-name.jpg&w=800&f=webp&q=80   800w,
    https://api.visionfly.ai/transform?src=cdn.visionfly.ai/user_id/image-name.jpg&w=1200&f=webp&q=80 1200w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Responsive image"
/>

<!-- Responsive image with different sizes -->
<img
  src="cdn.visionfly.ai/user_id/image-name.jpg"
  srcset="
    https://api.visionfly.ai/transform?src=cdn.visionfly.ai/user_id/image-name.jpg&w=400&f=webp&q=80   400w,
    https://api.visionfly.ai/transform?src=cdn.visionfly.ai/user_id/image-name.jpg&w=800&f=webp&q=80   800w,
    https://api.visionfly.ai/transform?src=cdn.visionfly.ai/user_id/image-name.jpg&w=1200&f=webp&q=80 1200w
  "
  sizes="(max-width: 480px) 100vw,
         (max-width: 768px) 80vw,
         50vw"
  alt="Responsive image"
/>
```

#### React

```jsx
import { useState, useEffect } from "react";
import { VisionFly } from "visionfly-sdk";

function ResponsiveImage({ imageUrl }) {
  const [srcsetData, setSrcsetData] = useState(null);
  const visionfly = new VisionFly({
    apiKey: "your-api-key",
    apiSecret: "your-api-secret",
  });

  useEffect(() => {
    async function generateSrcset() {
      try {
        const data = await visionfly.getSrcSet({
          src: imageUrl,
          widths: [400, 800, 1200],
          format: "webp",
          quality: 80,
        });
        setSrcsetData(data);
      } catch (error) {
        console.error("Failed to generate srcset:", error.message);
      }
    }
    generateSrcset();
  }, [imageUrl]);

  if (!srcsetData) return <div>Loading...</div>;

  return (
    <img
      src={srcsetData.default}
      srcSet={srcsetData.srcset}
      sizes={srcsetData.sizes}
      alt="Responsive image"
    />
  );
}

// Usage
function App() {
  return <ResponsiveImage imageUrl="cdn.visionfly.ai/user_id/image-name.jpg" />;
}
```

#### Next.js

```jsx
import { VisionFly } from "visionfly-sdk";
import Image from "next/image";

// Create a VisionFly instance
const visionfly = new VisionFly({
  apiKey: process.env.VISIONFLY_API_KEY,
  apiSecret: process.env.VISIONFLY_API_SECRET,
});

// Generate srcset data at build time or in getServerSideProps
export async function getServerSideProps() {
  try {
    const srcsetData = await visionfly.getSrcSet({
      src: "cdn.visionfly.ai/user_id/image-name.jpg",
      widths: [400, 800, 1200],
      format: "webp",
      quality: 80,
    });

    return {
      props: {
        srcsetData,
      },
    };
  } catch (error) {
    console.error("Failed to generate srcset:", error.message);
    return {
      props: {
        error: error.message,
      },
    };
  }
}

// Component using Next.js Image
function ResponsiveImage({ srcsetData, error }) {
  if (error) return <div>Error: {error}</div>;

  return (
    <Image
      src={srcsetData.default}
      srcSet={srcsetData.srcset}
      sizes={srcsetData.sizes}
      alt="Responsive image"
      width={1200} // Max width
      height={800} // Max height
      priority // Optional: Load image immediately
    />
  );
}

// Usage
export default function Page({ srcsetData, error }) {
  return <ResponsiveImage srcsetData={srcsetData} error={error} />;
}
```

## API Reference

### Core SDK

#### VisionFly Constructor

```javascript
new VisionFly({
  apiKey: string,      // Required: Your VisionFly API key
  apiSecret: string,   // Required: Your VisionFly API secret
  baseUrl?: string,    // Optional: API base URL (default: https://api.visionfly.ai)
  cdnUrl?: string      // Optional: CDN URL (default: https://cdn.visionfly.ai)
})
```

#### Methods

##### uploadImage(params)

Uploads an image to VisionFly.

```javascript
visionfly.uploadImage({
  file: File|Blob,     // Required: Image file to upload
  publicId?: string    // Optional: Custom public ID
})
```

Returns a Promise that resolves to an object containing:

- `public_url`: The CDN URL where the image can be accessed (format: cdn.visionfly.ai/user_id/image-name.jpg)
- Additional metadata about the uploaded image

##### transformImage(params)

Transforms an image URL according to the specified parameters.
Note: The source URL must be a VisionFly CDN URL (from upload).

```javascript
visionfly.transformImage({
  src: string,         // Required: VisionFly CDN URL (from upload)
  width?: number,      // Optional: Width in pixels
  height?: number,     // Optional: Height in pixels
  quality?: number,    // Optional: Image quality (1-100, default: 80)
  format?: string,     // Optional: Output format (auto, webp, avif, jpeg, png)
  blur?: number,       // Optional: Blur amount (0-100)
  sharpen?: number,    // Optional: Sharpen amount (0-100)
  brightness?: number, // Optional: Brightness adjustment (-100 to 100)
  contrast?: number,   // Optional: Contrast adjustment (-100 to 100)
  saturation?: number, // Optional: Saturation adjustment (-100 to 100)
  hue?: number        // Optional: Hue rotation (0-360)
})
```

##### getSrcSet(params)

Generates a responsive srcset for an image.
Note: The source URL must be a VisionFly CDN URL (from upload).

```javascript
visionfly.getSrcSet({
  src: string,         // Required: VisionFly CDN URL (from upload)
  widths?: number[]|string, // Optional: Array of widths or comma-separated string (default: [400,800,1200])
  format?: string,     // Optional: Output format (auto, webp, avif, jpeg, png, default: 'auto')
  quality?: number     // Optional: Image quality (1-100, default: 80)
})
```

Returns a Promise that resolves to an object containing:

- `srcset`: String of responsive image URLs with width descriptors
- `sizes`: Recommended sizes attribute
- `default`: Default image URL for the src attribute

##### clearCache()

Clears the URL cache.

```javascript
visionfly.clearCache();
```

## Error Handling

The SDK throws errors with descriptive messages for common issues:

- Invalid file types during upload
- Authentication failures
- Network errors
- Invalid parameters
- Invalid source URLs (must be VisionFly CDN URLs)

Example error handling:

```javascript
try {
  const result = await visionfly.uploadImage({
    file: imageFile,
  });
  console.log("Upload successful:", result);
} catch (error) {
  console.error("Upload failed:", error.message);
}
```

## License

ISC
