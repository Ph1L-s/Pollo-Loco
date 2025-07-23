class Enemy extends MovebleObject {

    x = 100;
    y = 390;

    height = 50;
    width = 50;

    IMAGES_WALKING_ENEMY = [
        'assets/images/sprites/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/images/sprites/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/images/sprites/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    currentImage = 0;

    constructor() {
        super().loadImage(this.IMAGES_WALKING_ENEMY[0]);
        this.loadImages(this.IMAGES_WALKING_ENEMY);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.35;
        this.animate();
    }

    animate() {
        this.moveLeft();

        setInterval(() => {
            let indexEnemey = this.currentImage % this.IMAGES_WALKING_ENEMY.length;
            let path = this.IMAGES_WALKING_ENEMY[indexEnemey];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 90);
    }


}
