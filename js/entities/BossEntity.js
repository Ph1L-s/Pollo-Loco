/**
 * @class BossEntity
 * @extends ObjectEntity
 * @summary boss enemy character with alert animation and death falling mechanics
 * @description larger enemy with alert state animation, collision detection, and death sequence
 */
class BossEntity extends ObjectEntity {
    height = 225;
    width = 175;
    y = 20;
    x = 2800;
    energy = 100;
    isDead = false;
    fallSpeed = 0;
    shouldRemove = false;
    speed = 0.5;
    walkSpeed = 0.5;
    lastHitTimeStamp = 0;
    isMoving = false;

    offset = {
        top: 90,
        bottom: 70,
        left: 40,
        right: 30
    };

    IMAGES_ALERT = [
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g5.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g6.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g7.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g8.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g9.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g10.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g11.png',
        'assets/images/sprites/4_enemie_boss_chicken/2_alert/g12.png',
    ];

    IMAGES_WALKING = [
        'assets/images/sprites/4_enemie_boss_chicken/1_walk/g1.png',
        'assets/images/sprites/4_enemie_boss_chicken/1_walk/g2.png',
        'assets/images/sprites/4_enemie_boss_chicken/1_walk/g3.png',
        'assets/images/sprites/4_enemie_boss_chicken/1_walk/g4.png'
    ];

    IMAGES_ATTACK = [
        'assets/images/sprites/4_enemie_boss_chicken/3_attack/g17.png',
        'assets/images/sprites/4_enemie_boss_chicken/3_attack/g18.png'
    ];

    IMAGES_HURT = [
        'assets/images/sprites/4_enemie_boss_chicken/4_hurt/g21.png',
        'assets/images/sprites/4_enemie_boss_chicken/4_hurt/g22.png',
        'assets/images/sprites/4_enemie_boss_chicken/4_hurt/g23.png'
    ];

    IMAGES_DEAD = [
        'assets/images/sprites/4_enemie_boss_chicken/5_dead/g24.png',
        'assets/images/sprites/4_enemie_boss_chicken/5_dead/g25.png',
        'assets/images/sprites/4_enemie_boss_chicken/5_dead/g26.png'
    ];

    /**
     * @summary initializes boss with all animations and physics
     * @description loads all sprite sets, applies gravity, sets up initial alert state
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.applyGravity();
        this.toggleCollision(true);
        this.startBossLogic();
    }

    startBossLogic() {
        // Animation interval
        setInterval(() => {
            if (this.isDead) {
                this.playAnimation(this.IMAGES_DEAD, 200);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT, 150);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_ATTACK, false);
            } else if (this.isMoving) {
                this.playAnimation(this.IMAGES_WALKING, 120);
            } else {
                this.playAnimation(this.IMAGES_ALERT, 150);
            }
        }, 140);

        // Movement interval
        setInterval(() => {
            if (this.isDead) {
                this.y += this.fallSpeed;
                this.fallSpeed += 0.5;
                if (this.y > 600) {
                    this.shouldRemove = true;
                }
            } else {
                this.randomWalk();
            }
        }, 1000 / 30);
    }

    randomWalk() {
        if (Math.random() < 0.01) {
            this.isMoving = !this.isMoving;
        }
        if (this.isMoving) {
            this.x -= this.walkSpeed;
        }
    }

    hit(damage = 20) {
        if (this.isDead || !this.hitTimeStamp()) return;
        
        this.energy -= damage;
        this.lastHitTimeStamp = new Date().getTime();
        
        if (this.energy <= 0) {
            this.energy = 0;
            this.startFalling();
        }
    }

    hitTimeStamp() {
        return new Date().getTime() - this.lastHitTimeStamp > 1000;
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHitTimeStamp;
        return timepassed < 1000 && this.energy > 0;
    }

    isDead() {
        return this.energy <= 0;
    }

    startFalling() {
        this.isDead = true;
        this.fallSpeed = -8;
    }
}