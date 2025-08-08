/**
 * @class Enemy
 * @extends ObjectEntity
 * @summary basic enemy character with walking animation and death falling mechanics
 * @description handles enemy movement, collision detection, and removal after death fall
 */
class Enemy extends ObjectEntity {
    x = 100;
    y = 360;
    height = 60;
    width = 60;
    isDead = false;
    fallSpeed = 0;
    shouldRemove = false;

    offset = {
        top: 10,
        bottom: 5,
        left: 10,
        right: 10
    };

    IMAGES_WALKING_ENEMY = [
        'assets/images/sprites/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/images/sprites/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/images/sprites/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'assets/images/sprites/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /**
     * @summary initializes enemy with random position, speed, and walking animation
     * @description loads walking sprites, sets random spawn position and movement speed
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING_ENEMY[0]);
        this.loadImages(this.IMAGES_WALKING_ENEMY);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 400 + Math.random() * 3200;
        this.speed = 0.22 + Math.random() * 0.51;
        this.startMovement();
        this.startWalkingAnimation();
    }

    /**
     * @summary starts enemy movement loop handling walking and death falling
     * @description moves left when alive, applies falling physics when dead until off-screen
     */
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

    /**
     * @summary starts walking animation loop for enemy
     * @description begins continuous walking sprite animation at 200ms intervals
     */
    startWalkingAnimation() {
        this.playAnimation(this.IMAGES_WALKING_ENEMY, 200);
    }

    /**
     * @summary initiates enemy death sequence with upward bounce and falling
     * @description marks as dead, applies initial upward velocity, stops walking animation, triggers 20% bottle drop chance
     */
    startFalling() {
        this.isDead = true;
        this.fallSpeed = -8;
        this.stopAnimation();
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
        
        if (window.menuManager) {
            window.menuManager.getSoundManager().playSFX('ENEMY_DIE');
        }
        
        if (Math.random() < 0.2) {
            this.dropBottle();
        }
    }

    /**
     * @summary handles bottle drop mechanics when enemy dies
     * @description notifies world to spawn dropped bottle at enemy center position
     */
    dropBottle() {
        if (this.world && this.world.spawnDroppedBottle) {
            this.world.spawnDroppedBottle(this.x + this.width/2, this.y + this.height/2);
        }
    }
}
