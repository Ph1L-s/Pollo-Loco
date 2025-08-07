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

    constructor() {
        super();
        this.loadImages(this.HEALTH_BAR_IMAGES);
        this.loadImages(this.COIN_BAR_IMAGES);
        this.loadImages(this.BOTTLE_BAR_IMAGES);
        this.x = 50;
        this.y = 10;
        this.width = 200;
        this.height = 50;
        this.setHealthPercentage(100);
    }

    setHealthPercentage(percentage) {
        this.healthPercentage = percentage;
        let imagePath = this.HEALTH_BAR_IMAGES[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[imagePath];
    }

    setCoinPercentage(percentage) {
        this.coinPercentage = percentage;
    }

    setBottlePercentage(percentage) {
        this.bottlePercentage = percentage;
    }

    setPercentage(percentage) {
        this.setHealthPercentage(percentage);
    }

    addCoin() {
        this.coinPercentage = Math.min(100, this.coinPercentage + 20);
    }

    addBottle() {
        if (this.bottleCount < 5) {
            this.bottleCount++;
            this.bottlePercentage = (this.bottleCount / 4) * 100;
        }
    }

    useBottle() {
        if (this.bottleCount > 0) {
            this.bottleCount--;
            this.bottlePercentage = (this.bottleCount / 5) * 100;
            return true;
        }
        return false;
    }

    hasBottles() {
        return this.bottleCount > 0;
    }

    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        
        let coinImagePath = this.COIN_BAR_IMAGES[this.resolveImageIndex(this.coinPercentage)];
        let coinImg = this.imageCache[coinImagePath];
        if (coinImg && coinImg.complete && coinImg.naturalWidth > 0) {
            ctx.drawImage(coinImg, this.x, this.y + 60, this.width, this.height);
        }

        let bottleImagePath = this.BOTTLE_BAR_IMAGES[this.resolveImageIndex(this.bottlePercentage)];
        let bottleImg = this.imageCache[bottleImagePath];
        if (bottleImg && bottleImg.complete && bottleImg.naturalWidth > 0) {
            ctx.drawImage(bottleImg, this.x, this.y + 120, this.width, this.height);
        }

        if (this.drawCollision) {
            this.drawCollision(ctx);
        }
    }

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