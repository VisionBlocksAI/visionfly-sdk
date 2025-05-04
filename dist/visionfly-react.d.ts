/**
 * VisionFly Provider component
 * @param {Object} props - Component props
 * @param {Object} props.config - VisionFly configuration
 * @param {React.ReactNode} props.children - Child components
 */
export function VisionFlyProvider({ config, children }: {
    config: Object;
    children: React.ReactNode;
}): any;
/**
 * Hook to access VisionFly client
 * @returns {Object} VisionFly context
 */
export function useVisionFly(): Object;
/**
 * Image component with optimization
 * @param {Object} props - Component props
 */
export function VFImage({ src, width, height, quality, format, blur, sharpen, brightness, contrast, saturation, hue, alt, className, style, loading, ...restProps }: Object): any;
/**
 * Responsive image component with srcset
 * @param {Object} props - Component props
 */
export function VFResponsiveImage({ src, widths, sizes, quality, format, alt, className, style, loading, ...restProps }: Object): any;
/**
 * Image uploader component
 * @param {Object} props - Component props
 */
export function VFUploader({ projectId, onUpload, onError, publicId, multiple, className, style, buttonClassName, buttonStyle, buttonText, children, ...restProps }: Object): any;
declare namespace _default {
    export { VisionFlyProvider };
    export { useVisionFly };
    export { VFImage };
    export { VFResponsiveImage };
    export { VFUploader };
}
export default _default;
