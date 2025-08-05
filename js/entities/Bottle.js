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

    collect() {
        this.collected = true;
    }

    isCollected() {
        return this.collected;
    }
}

window.Bottle = Bottle;