class Enemy extends ObjectEntity {
    x = 100;
    y = 360;
    height = 50;
    width = 50;

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
            this.moveLeft();
        }, 1000 / 30);
    }
}
