/**
 * @class DrawableObjects
 * @summary base drawable class providing rendering, image caching, and collision visualization
 * @description foundation class for all renderable game objects with position, dimensions, and debug features
 */
class DrawableObjects {
    x = 120;
    y = 120;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    moving = false;
    currentImage = 0;
    showCollision = false;

    /**
     * @summary initializes drawable object with default properties
     * @description creates base drawable instance with positioning and image caching
     */
    constructor() {}

    /**
     * @summary determines if collision boundary should be displayed for debugging
     * @description checks collision visualization flag for debug rendering
     * @returns {boolean} true if collision boundaries should be drawn
     */
    shouldShowCollision() {
        return this.showCollision; 
    }

    /**
     * @summary renders collision boundary rectangle with blue outline
     * @description draws debug collision box around object bounds when enabled
     * @param {CanvasRenderingContext2D} ctx - canvas rendering context for drawing
     */
    drawCollision(ctx) {
        if (!this.shouldShowCollision()) return;
        ctx.beginPath();
        ctx.lineWidth = '2';
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    /**
     * @summary preloads array of images using global cache or fallback
     * @description uses global image cache first, falls back to individual loading
     * @param {Array<string>} arr - array of image file paths to preload
     */
    loadImages(arr) {
        arr.forEach(path => {
            const globalImage = window.getGlobalImage ? window.getGlobalImage(path) : null;
            if (globalImage) {
                this.imageCache[path] = globalImage;
            } else {
                this.loadSingleImage(path);
            }
        });
    }

    /**
     * @summary loads single image with error handling and retry mechanism
     * @description implements retry logic for failed image loads, crucial for server deployment
     * @param {string} path - image file path to load
     * @param {number} retryCount - current retry attempt (max 3)
     */
    loadSingleImage(path, retryCount = 0) {
        if (this.imageCache[path] && this.imageCache[path].complete && this.imageCache[path].naturalWidth > 0) {
            return;
        }

        let img = new Image();
        
        img.onload = () => {
            this.imageCache[path] = img;
        };
        
        img.onerror = () => {
            console.warn(`Failed to load image: ${path} (attempt ${retryCount + 1})`);
            
            if (retryCount < 3) {
                setTimeout(() => {
                    this.loadSingleImage(path, retryCount + 1);
                }, Math.pow(2, retryCount) * 1000);
            } else {
                console.error(`Failed to load image after 3 attempts: ${path}`);
                this.createFallbackImage(path);
            }
        };
        
        const cacheBuster = this.shouldUseCacheBusting() ? `?t=${Date.now()}` : '';
        img.src = path + cacheBuster;
    }

    /**
     * @summary determines if cache-busting should be used for image loading
     * @description checks if running on server to add cache-busting parameters
     * @returns {boolean} true if cache-busting should be applied
     */
    shouldUseCacheBusting() {
        return location.hostname !== 'localhost' && 
               location.hostname !== '127.0.0.1' && 
               location.protocol !== 'file:';
    }

    /**
     * @summary creates fallback image for failed loads
     * @description creates colored rectangle as placeholder when image fails to load
     * @param {string} path - original image path that failed
     */
    createFallbackImage(path) {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.font = '12px Arial';
        ctx.fillText('IMG', 35, 55);
        
        const fallbackImg = new Image();
        fallbackImg.src = canvas.toDataURL();
        this.imageCache[path] = fallbackImg;
    }

    /**
     * @summary gets image from cache with safety checks
     * @description retrieves cached image with validation for complete loading
     * @param {string} path - image path to retrieve
     * @returns {Image|null} loaded image or null if not available
     */
    getImage(path) {
        const img = this.imageCache[path];
        if (img && img.complete && img.naturalWidth > 0) {
            return img;
        }
        return null;
    }

    /**
     * @summary enables or disables collision boundary visualization
     * @description sets collision display flag for debug rendering control
     * @param {boolean} show - whether to show collision boundaries
     */
    toggleCollision(show) {
        this.showCollision = show;
    }
}


window.DrawableObjects = DrawableObjects;