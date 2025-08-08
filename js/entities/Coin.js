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

    animate() {
        setInterval(() => {
            if (!this.collected) {
                this.currentFrame = (this.currentFrame + 1) % this.IMAGES_COIN.length;
                this.img = this.imageCache[this.IMAGES_COIN[this.currentFrame]];
            }
        }, 600);
    }

    collect() {
        this.collected = true;
    }

    isCollected() {
        return this.collected;
    }

    drawCollision(ctx) {
        if (!this.showCollision) return;
        ctx.beginPath();
        ctx.lineWidth = '2';
        ctx.strokeStyle = 'yellow';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    toggleCollision(show) {
        this.showCollision = show;
    }
}

window.Coin = Coin;