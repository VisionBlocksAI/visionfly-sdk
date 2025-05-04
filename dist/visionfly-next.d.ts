/**
 * VisionFly enhanced Next.js Image component
 * @param {Object} props - Component props
 */
export function VFNextImage({ src, width, height, quality, format, blur, sharpen, brightness, contrast, saturation, hue, alt, placeholder, ...restProps }: Object): any;
/**
 * VisionFly enhanced Next.js responsive Image component
 * @param {Object} props - Component props
 */
export function VFNextResponsiveImage({ src, widths, sizes, quality, format, fill, alt, placeholder, ...restProps }: Object): any;
/**
 * Setup VisionFly for Next.js app
 * @param {Object} config - VisionFly configuration
 * @param {Object} options - Additional options
 * @returns {Object} Next.js loader and other utilities
 */
export function setupVisionFly(config: Object, options?: Object): Object;
