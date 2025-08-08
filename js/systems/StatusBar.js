/**
 * @class StatusBar
 * @extends DrawableObjects
 * @summary ui status display system showing health, coins, and bottle inventory
 * @description manages visual status bars with color-coded progression and inventory tracking
 */
class StatusBar extends DrawableObjects {
    healthPercentage = 100;
    coinPercentage = 0;
    bottlePercentage = 0;
    bottleCount = 0;

    HEALTH_BAR_IMAGES = [
        'assets/images/ui/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
        'assets/images/ui/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
        'assets/images/ui/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
        'assets/images/ui/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'assets/images/ui/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'assets/images/ui/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    COIN_BAR_IMAGES = [
        'assets/images/ui/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'assets/images/ui/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'assets/images/ui/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'assets/images/ui/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'assets/images/ui/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'assets/images/ui/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    BOTTLE_BAR_IMAGES = [
        'assets/images/ui/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'assets/images/ui/7_statusbars/1_statusbar/3_statusbar_bottle/Orange/20.png',
        'assets/images/ui/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'assets/images/ui/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'assets/images/ui/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'assets/images/ui/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    /**
     * @summary initializes status bar with all ui images and positioning
     * @description loads status bar sprite sheets, sets screen position, starts with full health
     */
    constructor() {
        super();
        this.loadImages(this.HEALTH_BAR_IMAGES);
        this.loadImages(this.COIN_BAR_IMAGES);
        this.loadImages(this.BOTTLE_BAR_IMAGES);
        this.x = 50;
        this.y = 10;
        this.width = 150;
        this.height = 37;
        this.setHealthPercentage(100);
    }

    /**
     * @summary updates health bar display based on percentage value
     * @description maps percentage to appropriate status bar image with color progression
     * @param {number} percentage - health value from 0 to 100
     */
    setHealthPercentage(percentage) {
        this.healthPercentage = percentage;
        let imagePath = this.HEALTH_BAR_IMAGES[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[imagePath];
    }

    /**
     * @summary updates coin status bar percentage value
     * @description sets coin collection progress for ui display
     * @param {number} percentage - coin collection value from 0 to 100
     */
    setCoinPercentage(percentage) {
        this.coinPercentage = percentage;
    }

    /**
     * @summary updates bottle inventory status bar percentage
     * @description sets bottle collection progress for ui display
     * @param {number} percentage - bottle inventory value from 0 to 100
     */
    setBottlePercentage(percentage) {
        this.bottlePercentage = percentage;
    }

    /**
     * @summary generic percentage setter that updates health bar
     * @description convenience method for updating health status from external systems
     * @param {number} percentage - health percentage value to set
     */
    setPercentage(percentage) {
        this.setHealthPercentage(percentage);
    }

    /**
     * @summary adds coin to collection and updates percentage display
     * @description increases coin percentage by 20, capped at maximum 100
     */
    addCoin() {
        this.coinPercentage = Math.min(100, this.coinPercentage + 20);
    }

    removeCoin() {
        if (this.coinPercentage > 0) {
            this.coinPercentage = Math.max(0, this.coinPercentage - 20);
            return true;
        }
        return false;
    }

    /**
     * @summary adds bottle to inventory and updates visual percentage
     * @description increases bottle count up to maximum 5, recalculates percentage display
     */
    addBottle() {
        if (this.bottleCount < 5) {
            this.bottleCount++;
            this.bottlePercentage = (this.bottleCount / 4) * 100;
        }
    }

    /**
     * @summary consumes bottle from inventory for throwing action
     * @description decreases bottle count, updates percentage, returns success status
     * @returns {boolean} true if bottle was consumed, false if inventory empty
     */
    useBottle() {
        if (this.bottleCount > 0) {
            this.bottleCount--;
            this.bottlePercentage = (this.bottleCount / 5) * 100;
            return true;
        }
        return false;
    }

    /**
     * @summary checks if player has bottles available for throwing
     * @description returns availability status for bottle throwing actions
     * @returns {boolean} true if bottles are available in inventory
     */
    hasBottles() {
        return this.bottleCount > 0;
    }

    /**
     * @summary custom rendering method for status bar ui elements
     * @description draws health, coin, and bottle status bars stacked vertically on screen
     * @param {CanvasRenderingContext2D} ctx - canvas rendering context for drawing
     */
    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        
        let coinImagePath = this.COIN_BAR_IMAGES[this.resolveImageIndex(this.coinPercentage)];
        let coinImg = this.imageCache[coinImagePath];
        if (coinImg && coinImg.complete && coinImg.naturalWidth > 0) {
            ctx.drawImage(coinImg, this.x, this.y + 47, this.width, this.height);
        }

        let bottleImagePath = this.BOTTLE_BAR_IMAGES[this.resolveImageIndex(this.bottlePercentage)];
        let bottleImg = this.imageCache[bottleImagePath];
        if (bottleImg && bottleImg.complete && bottleImg.naturalWidth > 0) {
            ctx.drawImage(bottleImg, this.x, this.y + 94, this.width, this.height);
        }

        if (this.drawCollision) {
            this.drawCollision(ctx);
        }
    }

    /**
     * @summary converts percentage value to status bar image array index
     * @description maps percentage ranges to appropriate status bar sprite with color progression
     * @param {number} percentage - value from 0 to 100 to convert
     * @returns {number} array index (0-5) for status bar image selection
     */
    resolveImageIndex(percentage) {
        if (percentage == 100) {
            return 5;
        } else if (percentage > 80) {
            return 4;
        } else if (percentage > 60) {
            return 3;
        } else if (percentage > 40) {
            return 2;
        } else if (percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}

window.StatusBar = StatusBar;