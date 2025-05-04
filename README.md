# VisionFly SDK

A lightweight SDK for VisionFly image optimization and transformation service. This SDK is designed to make your websites faster by handling image optimization, responsive images, and seamless CDN integration.

## Features

- ⚡ **Fast & Lightweight**: Minimal dependencies and optimized code
- 🔄 **Responsive Images**: Automatic srcset generation for optimal image serving
- 🖼️ **Advanced Transformations**: Resize, format conversion, quality, effects
- 🛡️ **Secure**: Token-based authentication with automatic refresh
- ⚛️ **React Ready**: Purpose-built components for React applications
- 📱 **Next.js Integration**: Built-in support for Next.js Image component
- 📈 **Performance Optimized**: URL caching and intelligent loading
- 📤 **Upload Support**: Easily upload images to your VisionFly projects

## Installation

```bash
npm install visionfly-sdk
# or
yarn add visionfly-sdk
```

## Quick Start

### JavaScript (Vanilla)

```javascript
import VisionFly from "visionfly-sdk";

// Initialize the client
const visionfly = new VisionFly({
  apiKey: "your-api-key",
  apiSecret: "your-api-secret",
});

// Get an optimized image URL
async function getOptimizedImage() {
  const imageUrl = await visionfly.getImageUrl({
    src: "https://example.com/image.jpg",
    width: 800,
    height: 600,
    quality: 85,
    format: "webp",
  });

  // Use the URL in your app
  document.getElementById("myImage").src = imageUrl;
}
```

### React

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

### Next.js

```jsx
import React from "react";
import {
  VisionFlyProvider,
  VFNextImage,
  VFNextResponsiveImage,
} from "visionfly-sdk/next";

// Setup in _app.js or layout.js
function MyApp({ Component, pageProps }) {
  return (
    <VisionFlyProvider
      config={{
        apiKey: "your-api-key",
        apiSecret: "your-api-secret",
      }}
    >
      <Component {...pageProps} />
    </VisionFlyProvider>
  );
}

// Use in your pages/components
function MyPage() {
  return (
    <div>
      {/* Basic Next.js optimized image */}
      <VFNextImage
        src="https://example.com/image.jpg"
        width={600}
        height={400}
        alt="Optimized image"
      />

      {/* Responsive image with srcset */}
      <VFNextResponsiveImage
        src="https://example.com/image.jpg"
        widths={[320, 640, 960, 1280, 1920]}
        sizes="(max-width: 768px) 100vw, 50vw"
        alt="Responsive image"
        fill
      />
    </div>
  );
}
```

## Advanced Usage

### Image Transformations

VisionFly supports a wide range of image transformations:

```jsx
<VFImage
  src="https://example.com/image.jpg"
  width={600}
  height={400}
  quality={85} // 1-100
  format="webp" // 'auto', 'webp', 'avif', 'jpeg', 'png'
  blur={5} // 0-100
  sharpen={10} // 0-100
  brightness={10} // -100 to 100
  contrast={15} // -100 to 100
  saturation={-10} // -100 to 100
  hue={30} // 0-360
  alt="Enhanced image"
/>
```

### Art Direction with Responsive Images

```jsx
<VFResponsiveImage
  src="https://example.com/image.jpg"
  widths={[320, 640, 960, 1280]}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  format="webp"
  quality={85}
  alt="Art directed image"
/>
```

### Bulk Image Upload

```jsx
<VFUploader
  projectId="your-project-id"
  multiple={true}
  onUpload={(results) => {
    results.forEach((result) => {
      console.log(`Uploaded: ${result.public_url}`);
    });
  }}
  buttonText="Upload Multiple Images"
/>
```

### Custom Upload Button

```jsx
<VFUploader projectId="your-project-id" onUpload={handleUpload}>
  <button className="my-custom-button">
    <span>Choose Image</span>
    <svg>...</svg>
  </button>
</VFUploader>
```

## Core Concepts

### Image Optimization

VisionFly optimizes images in several ways:

1. **Format Conversion**: Automatically serves images in modern formats like WebP and AVIF
2. **Resizing**: Delivers images at the exact size needed
3. **Quality Adjustment**: Balances visual quality with file size
4. **Visual Enhancements**: Applies transformations like sharpening for better looking images

### Responsive Images

Modern websites need to serve different image sizes to different devices. VisionFly makes this easy by:

1. **Automatic Srcset Generation**: Creates multiple image versions at different sizes
2. **Sizes Attribute**: Helps browsers choose the right image size
3. **Easy Integration**: Works with both plain HTML `<img>` tags and framework components

### Security

VisionFly SDK uses secure token-based authentication:

1. **API Keys**: Used only to obtain access tokens
2. **Access Tokens**: Short-lived tokens for API requests
3. **Refresh Tokens**: Used to get new access tokens when they expire
4. **Automatic Refresh**: SDK handles token management behind the scenes

## Benefits for Website Performance

- **Reduced Page Weight**: Optimized images can be 60-80% smaller than originals
- **Faster Loading**: Smaller images = faster page loads
- **Better Core Web Vitals**: Improves LCP (Largest Contentful Paint)
- **SEO Benefits**: Google rewards faster websites with better rankings
- **Reduced Bandwidth**: Save on hosting costs and bandwidth usage
- **Improved Mobile Experience**: Faster loading on mobile networks

## Common Use Cases

### E-commerce Product Images

```jsx
<VFResponsiveImage
  src="https://example.com/product.jpg"
  widths={[320, 640, 960]}
  format="webp"
  quality={85}
  alt="Product image"
/>
```

### Hero Images

```jsx
<VFResponsiveImage
  src="https://example.com/hero.jpg"
  widths={[768, 1024, 1440, 1920]}
  sizes="100vw"
  quality={85}
  format="webp"
  alt="Hero image"
/>
```

### Image Galleries

```jsx
{
  images.map((image) => (
    <VFImage
      key={image.id}
      src={image.url}
      width={300}
      height={200}
      alt={image.alt}
    />
  ));
}
```

### User-Generated Content

```jsx
<VFUploader
  projectId="user-content"
  publicId={`user-${userId}-${Date.now()}`}
  onUpload={handleProfileImageUpload}
  buttonText="Upload Profile Picture"
/>
```

## API Reference

Complete API documentation is available at [docs.visionfly.ai](https://docs.visionfly.ai).

## License

MIT
