/**
 * @class BossEntity
 * @extends ObjectEntity
 * @summary boss enemy character with alert animation and death falling mechanics
 * @description larger enemy with alert state animation, collision detection, and death sequence
 */
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

    /**
     * @summary initializes boss with alert animation and collision detection enabled
     * @description loads alert sprites, starts animation loop, enables collision boundaries
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING_ENEMY[0]);
        this.loadImages(this.IMAGES_WALKING_ENEMY);
        this.playAnimation(this.IMAGES_WALKING_ENEMY, 120);
        this.toggleCollision(true);
        this.startMovement();
    }

    /**
     * @summary handles boss death falling physics when killed
     * @description applies accelerating downward movement until boss falls off screen
     */
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

    /**
     * @summary initiates boss death sequence with upward bounce and falling
     * @description marks as dead, applies initial upward velocity, stops alert animation
     */
    startFalling() {
        this.isDead = true;
        this.fallSpeed = -8;
        this.stopAnimation();
    }
}