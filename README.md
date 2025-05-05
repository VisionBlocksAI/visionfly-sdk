# VisionFly SDK

Official SDK for VisionFly Image API - Image optimization, transformation, and delivery.

## Installation

```bash
npm install visionfly-sdk
```

## Usage

### Core SDK

```javascript
import { VisionFly } from "visionfly-sdk";

// Initialize the SDK with your API key and secret
const visionfly = new VisionFly({
  apiKey: "your-api-key",
  apiSecret: "your-api-secret",
  baseUrl: "https://api.visionfly.ai", // optional
  cdnUrl: "https://cdn.visionfly.ai", // optional
});

// Get an optimized image URL
const imageUrl = await visionfly.getImageUrl({
  src: "https://example.com/image.jpg",
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

// Generate a responsive srcset
const srcsetData = await visionfly.getSrcSet({
  src: "https://example.com/image.jpg",
  widths: [400, 800, 1200],
  format: "webp",
  quality: 80,
});

// Upload an image
const uploadResult = await visionfly.uploadImage({
  file: imageFile,
  projectId: "your-project-id",
  publicId: "optional-custom-id",
});

// Clear URL cache if needed
visionfly.clearCache();
```

### React Components

```jsx
import React from "react";
import {
  VisionFlyProvider,
  VFImage,
  VFResponsiveImage,
  VFUploader,
} from "visionfly-sdk/react";

// App component with VisionFly setup
function App() {
  return (
    <VisionFlyProvider
      config={{
        apiKey: "your-api-key",
        apiSecret: "your-api-secret",
      }}
    >
      <MyComponent />
    </VisionFlyProvider>
  );
}

// Component using VisionFly components
function MyComponent() {
  const handleUpload = (result) => {
    console.log("Upload successful:", result);
    // Use the uploaded image URL: result.public_url
  };

  return (
    <div>
      {/* Basic optimized image */}
      <VFImage
        src="https://example.com/image.jpg"
        width={600}
        height={400}
        alt="Optimized image"
      />

      {/* Responsive image with srcset */}
      <VFResponsiveImage
        src="https://example.com/image.jpg"
        widths={[320, 640, 960, 1280, 1920]}
        sizes="(max-width: 768px) 100vw, 50vw"
        alt="Responsive image"
      />

      {/* Image uploader */}
      <VFUploader projectId="your-project-id" onUpload={handleUpload} />
    </div>
  );
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

##### getImageUrl(params)

Transforms an image URL according to the specified parameters.

```javascript
visionfly.getImageUrl({
  src: string,         // Required: Source image URL
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

```javascript
visionfly.getSrcSet({
  src: string,         // Required: Source image URL
  widths?: number[],   // Optional: Array of widths (default: [400, 800, 1200])
  format?: string,     // Optional: Output format (default: 'auto')
  quality?: number     // Optional: Image quality (default: 80)
})
```

##### uploadImage(params)

Uploads an image to VisionFly.

```javascript
visionfly.uploadImage({
  file: File|Blob,     // Required: Image file to upload
  projectId: string,   // Required: Project ID
  publicId?: string    // Optional: Custom public ID
})
```

##### clearCache()

Clears the URL cache.

```javascript
visionfly.clearCache();
```

### React Components

#### VisionFlyProvider

Provider component that makes the VisionFly SDK available to all child components.

```jsx
<VisionFlyProvider
  config={{
    apiKey: string, // Required: Your VisionFly API key
    apiSecret: string, // Required: Your VisionFly API secret
  }}
>
  {children}
</VisionFlyProvider>
```

#### VFImage

Basic optimized image component.

```jsx
<VFImage
  src: string,         // Required: Source image URL
  width: number,       // Required: Width in pixels
  height: number,      // Required: Height in pixels
  alt: string,         // Required: Alt text
  quality?: number,    // Optional: Image quality (1-100)
  format?: string,     // Optional: Output format
  blur?: number,       // Optional: Blur amount
  sharpen?: number,    // Optional: Sharpen amount
  brightness?: number, // Optional: Brightness adjustment
  contrast?: number,   // Optional: Contrast adjustment
  saturation?: number, // Optional: Saturation adjustment
  hue?: number        // Optional: Hue rotation
/>
```

#### VFResponsiveImage

Responsive image component with automatic srcset generation.

```jsx
<VFResponsiveImage
  src: string,         // Required: Source image URL
  widths: number[],    // Required: Array of widths
  sizes: string,       // Required: Sizes attribute
  alt: string,         // Required: Alt text
  quality?: number,    // Optional: Image quality
  format?: string      // Optional: Output format
/>
```

#### VFUploader

Image upload component.

```jsx
<VFUploader
  projectId: string,   // Required: Project ID
  onUpload: function,  // Required: Upload callback
  publicId?: string,   // Optional: Custom public ID
  multiple?: boolean   // Optional: Allow multiple files
/>
```

## License

ISC
