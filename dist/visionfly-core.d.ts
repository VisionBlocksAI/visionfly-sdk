export default VisionFly;
/**
 * VisionFly - Lightweight Image Optimization SDK
 * @version 1.0.0
 */
/**
 * Core VisionFly client
 */
declare class VisionFly {
    /**
     * Initialize VisionFly SDK
     * @param {Object} config - Configuration options
     * @param {string} config.apiKey - Your VisionFly API key
     * @param {string} config.apiSecret - Your VisionFly API secret
     * @param {string} [config.baseUrl='https://api.visionfly.ai'] - Base API URL
     * @param {string} [config.cdnUrl='https://cdn.visionfly.ai'] - CDN URL
     */
    constructor({ apiKey, apiSecret, baseUrl, cdnUrl, }: {
        apiKey: string;
        apiSecret: string;
        baseUrl?: string | undefined;
        cdnUrl?: string | undefined;
    });
    apiKey: string;
    apiSecret: string;
    baseUrl: string;
    cdnUrl: string;
    token: any;
    tokenExpiry: number | null;
    refreshToken: any;
    urlCache: Map<any, any>;
    /**
     * Internal method to handle authentication
     * @private
     */
    private _ensureAuthenticated;
    /**
     * Authenticate with the API
     * @private
     */
    private _authenticate;
    /**
     * Refresh the auth token
     * @private
     */
    private _refreshToken;
    /**
     * Make an authenticated request to the API
     * @private
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>} Response data
     */
    private _request;
    /**
     * Get a CDN URL for an image with transformations
     * @param {Object} params - Transformation parameters
     * @param {string} params.src - Source image URL
     * @param {number} [params.width] - Width in pixels
     * @param {number} [params.height] - Height in pixels
     * @param {number} [params.quality=80] - Image quality (1-100)
     * @param {string} [params.format='auto'] - Output format (auto, webp, avif, jpeg, png)
     * @param {number} [params.blur] - Blur amount (0-100)
     * @param {number} [params.sharpen] - Sharpen amount (0-100)
     * @param {number} [params.brightness] - Brightness adjustment (-100 to 100)
     * @param {number} [params.contrast] - Contrast adjustment (-100 to 100)
     * @param {number} [params.saturation] - Saturation adjustment (-100 to 100)
     * @param {number} [params.hue] - Hue rotation (0-360)
     * @returns {Promise<string>} CDN URL
     */
    getImageUrl(params: {
        src: string;
        width?: number | undefined;
        height?: number | undefined;
        quality?: number | undefined;
        format?: string | undefined;
        blur?: number | undefined;
        sharpen?: number | undefined;
        brightness?: number | undefined;
        contrast?: number | undefined;
        saturation?: number | undefined;
        hue?: number | undefined;
    }): Promise<string>;
    /**
     * Generate a responsive srcset for an image
     * @param {Object} params - Srcset parameters
     * @param {string} params.src - Source image URL
     * @param {Array<number>|string} [params.widths=[400,800,1200]] - Array or comma-separated string of widths
     * @param {string} [params.format='auto'] - Output format
     * @param {number} [params.quality=80] - Image quality
     * @returns {Promise<Object>} Srcset data with processed URLs
     */
    getSrcSet(params: {
        src: string;
        widths?: string | number[] | undefined;
        format?: string | undefined;
        quality?: number | undefined;
    }): Promise<Object>;
    /**
     * Upload an image to VisionFly
     * @param {Object} params - Upload parameters
     * @param {File|Blob} params.file - Image file to upload
     * @param {string} params.projectId - Project ID
     * @param {string} [params.publicId] - Optional custom public ID
     * @returns {Promise<Object>} Upload result
     */
    uploadImage(params: {
        file: File | Blob;
        projectId: string;
        publicId?: string | undefined;
    }): Promise<Object>;
    /**
     * Clear URL cache
     */
    clearCache(): void;
}
