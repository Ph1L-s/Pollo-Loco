class BossEntity extends ObjectEntity {
    height = 150;
    width = 150;
    y = 270;
    x = 600;
    isDead = false;
    fallSpeed = 0;
    shouldRemove = false;

    IMAGES_WALKING_ENEMY = [
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g5.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g6.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g7.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g8.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g9.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g10.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g11.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g12.png',
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING_ENEMY[0]);
        this.loadImages(this.IMAGES_WALKING_ENEMY);
        this.playAnimation(this.IMAGES_WALKING_ENEMY, 120);
        this.toggleCollision(true);
        this.startMovement();
    }

    startMovement() {
        setInterval(() => {
            if (this.isDead) {
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