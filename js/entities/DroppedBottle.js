/**
 * @class DroppedBottle
 * @extends DrawableObjects
 * @summary dropped bottle item with collision detection and collection state
 * @description handles dropped bottle pickup mechanics using different sprite than normal bottles
 */
class DroppedBottle extends DrawableObjects {
    offset = {
        top: 10,
        bottom: 5,
        left: 5,
        right: 5
    };

    /**
     * @summary initializes dropped bottle at specified world position
     * @description creates bottle sprite, sets collision boundaries, marks as uncollected
     * @param {number} x - horizontal world position for bottle placement
     * @param {number} y - vertical world position for bottle placement
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 50;
        this.img = new Image();
        this.img.src = 'assets/images/sprites/6_salsa_bottle/1_salsa_bottle_on_ground.png';
        this.collected = false;
    }

    /**
     * @summary determines if bottle should display collision boundary for debugging
     * @description bottles always show collision boxes for pickup area visualization
     * @returns {boolean} true - bottles always show collision boundaries
     */
    shouldShowCollision() {
        return true;
    }

    /**
     * @summary renders collision boundary rectangle with red outline for bottles
     * @description draws red collision box to distinguish bottles from other game objects
     * @param {CanvasRenderingContext2D} ctx - canvas rendering context for drawing
     */
    drawCollision(ctx) {
        if (!this.shouldShowCollision() || !this.showCollision) return;
        ctx.beginPath();
        ctx.lineWidth = '2';
        ctx.strokeStyle = 'red';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    /**
     * @summary marks bottle as collected by player character
     * @description sets collection state to prevent duplicate pickup
     */
    collect() {
        this.collected = true;
    }

    /**
     * @summary checks if bottle has been collected by player
     * @description returns collection status for pickup system logic
     * @returns {boolean} true if bottle has been collected
     */
    isCollected() {
        return this.collected;
    }
}

window.DroppedBottle = DroppedBottle;