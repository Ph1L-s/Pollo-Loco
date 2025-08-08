/**
 * @class BossStatusBar
 * @extends DrawableObjects
 * @summary boss health status bar with percentage-based display
 * @description renders boss health bar above boss position with blue color scheme
 */
class BossStatusBar extends DrawableObjects {
    percentage = 100;

    IMAGES = [
        'assets/images/ui/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'assets/images/ui/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'assets/images/ui/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'assets/images/ui/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'assets/images/ui/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'assets/images/ui/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];

    /**
     * @summary initializes boss status bar with full health display
     * @description loads status bar images and sets initial position and size
     * @param {number} x - horizontal position above boss
     * @param {number} y - vertical position above boss
     */
    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * @summary updates boss health percentage and corresponding status bar image
     * @description selects appropriate status bar image based on health percentage
     * @param {number} percentage - boss health percentage (0-100)
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * @summary calculates image index based on current health percentage
     * @description maps health percentage to corresponding status bar image
     * @returns {number} index of status bar image to display
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * @summary updates status bar position to follow boss
     * @description moves status bar to stay above boss entity
     * @param {number} bossX - boss x coordinate
     * @param {number} bossY - boss y coordinate
     */
    updatePosition(bossX, bossY) {
        this.x = bossX - 12;
        this.y = bossY - 80;
    }
}