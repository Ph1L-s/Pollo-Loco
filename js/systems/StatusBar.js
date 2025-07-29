class StatusBar extends DrawableObjects {
    percentage = 100;

    HEALTH_BAR_IMAGES = [
        'assets/images/ui/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'assets/images/ui/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'assets/images/ui/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'assets/images/ui/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'assets/images/ui/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'assets/images/ui/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];

    constructor() {
        super();
        this.loadImages(this.HEALTH_BAR_IMAGES);
        this.x = 50;
        this.y = 10;
        this.width = 200;
        this.height = 50;
        this.setPercentage(100);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let imagePath = this.HEALTH_BAR_IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[imagePath];
    }

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
}

window.StatusBar = StatusBar;