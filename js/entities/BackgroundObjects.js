/**
 * @class BackgroundObject
 * @extends ObjectEntity
 * @summary static background layer element for level scenery
 * @description creates positioned background images for parallax scrolling layers
 */
class BackgroundObject extends ObjectEntity {
    width = 720;
    height = 480;

    /**
     * @summary initializes background object with image and world position
     * @description loads background sprite and sets position for layer arrangement
     * @param {string} imagePath - path to background image file
     * @param {number} x - horizontal world position (default 0)
     * @param {number} y - vertical world position (default 0)
     */
    constructor(imagePath, x = 0, y = 0) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
    }
    
}
