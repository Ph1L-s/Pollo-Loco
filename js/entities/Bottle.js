class Bottle extends DrawableObjects {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.img = new Image();
        this.img.src = 'assets/images/sprites/6_salsa_bottle/salsa_bottle.png';
        this.collected = false;
    }

    shouldShowCollision() {
        return true; // Always show collision box for bottles
    }

    drawCollision(ctx) {
        if (!this.shouldShowCollision() || !this.showCollision) return;
        ctx.beginPath();
        ctx.lineWidth = '2';
        ctx.strokeStyle = 'red'; // Use red color for bottles to distinguish from other objects
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    collect() {
        this.collected = true;
    }

    isCollected() {
        return this.collected;
    }
}

window.Bottle = Bottle;