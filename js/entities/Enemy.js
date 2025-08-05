class Enemy extends ObjectEntity {
    x = 100;
    y = 360;
    height = 50;
    width = 50;
    isDead = false;
    fallSpeed = 0;
    shouldRemove = false;

    IMAGES_WALKING_ENEMY = [
        'assets/images/sprites/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/images/sprites/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/images/sprites/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING_ENEMY[0]);
        this.loadImages(this.IMAGES_WALKING_ENEMY);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.35;
        this.startMovement();
        this.playAnimation(this.IMAGES_WALKING_ENEMY, 90);
    }

    startMovement() {
        setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            } else {
                this.y += this.fallSpeed;
                this.fallSpeed += 0.5;
                if (this.y > 600) {
                    this.shouldRemove = true;
                }
            }
        }, 1000 / 30);
    }

    startFalling() {
        this.isDead = true;
        this.fallSpeed = -8;
        this.stopAnimation();
    }
}
