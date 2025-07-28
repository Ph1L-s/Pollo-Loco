class BossEntity extends ObjectEntity {
    height = 150;
    width = 150;
    y = 270;
    x = 600;

    IMAGES_WALKING_ENEMY = [
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING_ENEMY[0]);
        this.loadImages(this.IMAGES_WALKING_ENEMY);
        this.playAnimation(this.IMAGES_WALKING_ENEMY, 120);
        this.toggleCollision(true);
    }
}