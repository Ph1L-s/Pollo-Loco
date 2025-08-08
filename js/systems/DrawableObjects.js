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
     * @summary preloads array of images into memory cache for fast access
     * @description creates image objects and stores in cache using path as key
     * @param {Array<string>} arr - array of image file paths to preload
     */
    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
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