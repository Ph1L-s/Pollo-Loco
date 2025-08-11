/**
 * @class SmallEnemy
 * @extends ObjectEntity
 * @summary small enemy character with hopping movement, faster walking animation and death falling mechanics
 * @description handles small enemy movement with periodic hopping like player curve, collision detection, and removal after death fall
 */
class SmallEnemy extends ObjectEntity {
    x = 100;
    y = 360;
    height = 50;
    width = 50;
    isDead = false;
    fallSpeed = 0;
    shouldRemove = false;
    
    isHopping = false;
    hopHeight = 0;
    maxHopHeight = 16;
    hopSpeed = 1.2;
    hopDirection = 1;
    baseY = 360;
    hopTimer = 0;
    hopInterval = 60;

    offset = {
        top: 10,
        bottom: 5,
        left: 10,
        right: 10
    };

    IMAGES_WALKING_ENEMY = [
        'assets/images/sprites/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/images/sprites/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/images/sprites/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'assets/images/sprites/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * @summary initializes small enemy with random position, faster speed, hopping movement and walking animation
     * @description loads walking sprites, sets random spawn position, movement speed, and initializes hopping mechanics
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING_ENEMY[0]);
        this.loadImages(this.IMAGES_WALKING_ENEMY);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 400 + Math.random() * 3200;
        this.baseY = this.y;
        this.speed = 0.15 + Math.random() * 0.25;
        
        this.hopTimer = Math.random() * this.hopInterval;
        
        this.startMovement();
        this.startWalkingAnimation();
    }

    /**
     * @summary starts enemy movement loop handling walking, hopping, and death falling
     * @description moves left when alive with hopping motion, applies falling physics when dead until off-screen
     */
    startMovement() {
        setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
                this.updateHopping();
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
     * @summary starts walking animation loop for small enemy
     * @description begins continuous walking sprite animation at 180ms intervals (faster than normal enemy)
     */
    startWalkingAnimation() {
        this.playAnimation(this.IMAGES_WALKING_ENEMY, 180);
    }

    /**
     * @summary updates hopping movement mechanics for small chickens with realistic gravity
     * @description handles periodic small hops with accelerated falling motion for natural gravity effect
     */
    updateHopping() {
        this.hopTimer++;
        
        if (this.hopTimer >= this.hopInterval && !this.isHopping) {
            this.startHop();
        }
        
        if (this.isHopping) {
            if (this.hopDirection === 1) {
                this.hopHeight += this.hopSpeed;
            } else {
                this.hopHeight -= this.hopSpeed * 1.5;
            }
            if (this.hopHeight >= this.maxHopHeight) {
                this.hopDirection = -1;
            }
            if (this.hopHeight <= 0) {
                this.hopHeight = 0;
                this.hopDirection = 1;
                this.isHopping = false;
                this.hopTimer = 0;
            }
            this.y = this.baseY - this.hopHeight;
        }
    }

    /**
     * @summary initiates a new hopping cycle
     * @description begins upward hop motion with reset timing
     */
    startHop() {
        this.isHopping = true;
        this.hopHeight = 0;
        this.hopDirection = 1;
    }

    /**
     * @summary initiates small enemy death sequence with upward bounce and falling
     * @description marks as dead, stops hopping, applies initial upward velocity, stops walking animation, triggers 20% bottle drop chance
     */
    startFalling() {
        this.isDead = true;
        this.isHopping = false;
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
     * @summary handles bottle drop mechanics when small enemy dies
     * @description notifies world to spawn dropped bottle at small enemy center position
     */
    dropBottle() {
        if (this.world && this.world.spawnDroppedBottle) {
            this.world.spawnDroppedBottle(this.x + this.width/2, this.y + this.height/2);
        }
    }
}