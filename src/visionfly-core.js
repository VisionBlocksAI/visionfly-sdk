/**
 * VisionFly - Lightweight Image Optimization SDK
 * @version 1.0.0
 */

/**
 * Core VisionFly client
 */
class VisionFly {
  /**
   * Initialize VisionFly SDK
   * @param {Object} config - Configuration options
   * @param {string} config.apiKey - Your VisionFly API key
   * @param {string} config.apiSecret - Your VisionFly API secret
   * @param {string} [config.baseUrl='https://api.visionfly.ai'] - Base API URL
   * @param {string} [config.cdnUrl='https://cdn.visionfly.ai'] - CDN URL
   */
  constructor({
    apiKey,
    apiSecret,
    baseUrl = "https://api.visionfly.ai",
    cdnUrl = "https://cdn.visionfly.ai",
  }) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseUrl = baseUrl;
    this.cdnUrl = cdnUrl;
    this.token = null;
    this.tokenExpiry = null;
    this.refreshToken = null;

    // Cache for transformed URLs
    this.urlCache = new Map();
  }

  /**
   * Internal method to handle authentication
   * @private
   */
  async _ensureAuthenticated() {
    // If token exists and is valid, return
    if (this.token && this.tokenExpiry && this.tokenExpiry > Date.now()) {
      return;
    }

    // If token expired or not set, authenticate
    await this._authenticate();
  }

  /**
   * Authenticate with the API
   * @private
   */
  async _authenticate() {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: this.apiKey,
          api_secret: this.apiSecret,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Authentication failed");
      }

      const data = await response.json();
      this.token = data.access_token;
      this.refreshToken = data.refresh_token;
      // Set expiry 5 minutes before actual expiry as a buffer
      this.tokenExpiry = Date.now() + data.expires_in * 1000 - 5 * 60 * 1000;
    } catch (error) {
      console.error("VisionFly authentication error:", error);
      throw error;
    }
  }

  /**
   * Refresh the auth token
   * @private
   */
  async _refreshToken() {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refresh_token: this.refreshToken,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Token refresh failed");
      }

      const data = await response.json();
      this.token = data.access_token;
      this.refreshToken = data.refresh_token;
      this.tokenExpiry = Date.now() + data.expires_in * 1000 - 5 * 60 * 1000;
    } catch (error) {
      console.error("VisionFly token refresh error:", error);
      throw error;
    }
  }

  /**
   * Make an authenticated request to the API
   * @private
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  async _request(endpoint, options = {}) {
    await this._ensureAuthenticated();

    const defaultOptions = {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };

    const fullOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      let response = await fetch(`${this.baseUrl}${endpoint}`, fullOptions);

      // Handle token expiration
      if (response.status === 401) {
        await this._refreshToken();
        fullOptions.headers.Authorization = `Bearer ${this.token}`;
        response = await fetch(`${this.baseUrl}${endpoint}`, fullOptions);
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.msg || `Request failed with status ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("VisionFly request error:", error);
      throw error;
    }
  }

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
  async transformImage(params) {
    // Generate a cache key from the params
    const cacheKey = JSON.stringify(params);

    // Check cache first
    if (this.urlCache.has(cacheKey)) {
      return this.urlCache.get(cacheKey);
    }

    // Build query for the API
    const apiParams = new URLSearchParams();

    // Map user-friendly param names to API param names
    const paramMap = {
      src: "src",
      width: "w",
      height: "h",
      quality: "q",
      format: "f",
      blur: "blur",
      sharpen: "sharp",
      brightness: "bri",
      contrast: "con",
      saturation: "sat",
      hue: "hue",
    };

    // Add all params to query
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const apiKey = paramMap[key] || key;
        apiParams.append(apiKey, value);
      }
    });

    // Get the transformed URL from the API
    const endpoint = `/transform?${apiParams.toString()}`;
    const result = await this._request(endpoint);

    if (!result.public_url) {
      throw new Error("Transform API did not return a public_url");
    }

    // Cache the result
    this.urlCache.set(cacheKey, result.public_url);

    return result.public_url;
  }

  /**
   * Generate a responsive srcset for an image
   * @param {Object} params - Srcset parameters
   * @param {string} params.src - Source image URL (must be a VisionFly CDN URL)
   * @param {Array<number>|string} [params.widths=[400,800,1200]] - Array or comma-separated string of widths
   * @param {string} [params.format='auto'] - Output format (auto, webp, avif, jpeg, png)
   * @param {number} [params.quality=80] - Image quality (1-100)
   * @returns {Promise<Object>} Srcset data with processed URLs
   */
  async getSrcSet(params) {
    const {
      src,
      widths = [400, 800, 1200],
      format = "auto",
      quality = 80,
    } = params;

    // Validate that URL is a VisionFly CDN URL
    if (!src.startsWith("https://cdn.visionfly.ai/")) {
      throw new Error("Source URL must be a VisionFly CDN URL");
    }

    // Convert widths array to string if needed
    const widthsStr = Array.isArray(widths) ? widths.join(",") : widths;

    // Get srcset data from API
    const apiParams = new URLSearchParams({
      src,
      w: widthsStr,
      f: format,
      q: quality,
    });

    const srcsetData = await this._request(
      `/generate/srcset?${apiParams.toString()}`
    );

    return srcsetData;
  }

  /**
   * Upload an image to VisionFly
   * @param {Object} params - Upload parameters
   * @param {File|Blob} params.file - Image file to upload
   * @param {string} [params.publicId] - Optional custom public ID
   * @returns {Promise<Object>} Upload result with metadata and CDN URL
   */
  async uploadImage(params) {
    const { file, publicId } = params;

    // Validate file type
    if (!file.type || !file.type.startsWith("image/")) {
      throw new Error("Invalid file type. Only image files are allowed.");
    }

    // Create form data
    const formData = new FormData();
    formData.append("file", file);

    if (publicId) {
      formData.append("public_id", publicId);
    }

    // Upload the image
    return this._request("/upload", {
      method: "POST",
      body: formData,
      // Don't set Content-Type header for FormData
      headers: {},
    });
  }

  /**
   * Clear URL cache
   */
  clearCache() {
    this.urlCache.clear();
  }
}

export { VisionFly };
