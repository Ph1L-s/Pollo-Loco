/**
 * @class Coin
 * @extends DrawableObjects
 * @summary collectible coin entity with animated sprite and collision detection
 * @description handles coin animation, collection state, and visual rendering for player collection
 */
class Coin extends DrawableObjects {
    IMAGES_COIN = [
        'assets/images/ui/8_coin/coin_1.png',
        'assets/images/ui/8_coin/coin_2.png'
    ];

    offset = {
        top: 35,
        bottom: 35,
        left: 35,
        right: 35
    };

    /**
     * @summary initializes coin entity with position, dimensions, and animation
     * @description creates coin with specified coordinates, loads sprites, starts animation loop
     * @param {number} x - horizontal position coordinate
     * @param {number} y - vertical position coordinate
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.collected = false;
        this.currentFrame = 0;
        this.img = new Image();
        this.img.src = this.IMAGES_COIN[0];
        this.loadImages(this.IMAGES_COIN);
        this.animate();
    }

    /**
     * @summary starts continuous coin animation cycle
     * @description animates coin sprite by cycling through frames at 600ms intervals
     */
    animate() {
        setInterval(() => {
            if (!this.collected) {
                this.currentFrame = (this.currentFrame + 1) % this.IMAGES_COIN.length;
                this.img = this.imageCache[this.IMAGES_COIN[this.currentFrame]];
            }
        }, 600);
    }

    /**
     * @summary marks coin as collected and stops animation
     * @description sets collected flag to prevent further animation and interaction
     */
    collect() {
        this.collected = true;
    }

    /**
     * @summary checks if coin has been collected by player
     * @description returns current collection state for game logic processing
     * @returns {boolean} true if coin has been collected, false otherwise
     */
    isCollected() {
        return this.collected;
    }

    /**
     * @summary renders yellow collision boundary rectangle for debugging
     * @description draws collision box around coin when debug mode is enabled
     * @param {CanvasRenderingContext2D} ctx - canvas rendering context for drawing
     */
    drawCollision(ctx) {
        if (!this.showCollision) return;
        ctx.beginPath();
        ctx.lineWidth = '2';
        ctx.strokeStyle = 'yellow';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    /**
     * @summary enables or disables collision boundary visualization
     * @description controls whether collision debug rectangle is displayed
     * @param {boolean} show - true to show collision boundaries, false to hide
     */
    toggleCollision(show) {
        this.showCollision = show;
    }
}

window.Coin = Coin;