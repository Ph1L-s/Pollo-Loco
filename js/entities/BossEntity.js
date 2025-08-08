/**
 * @class BossEntity
 * @extends ObjectEntity
 * @summary boss enemy character with alert animation and death falling mechanics
 * @description larger enemy with alert state animation, collision detection, and death sequence
 */
class BossEntity extends ObjectEntity {
    height = 270;
    width = 210;
    y = 150;
    x = 3800;
    energy = 100;
    fallSpeed = 0;
    shouldRemove = false;
    speed = 1.44;
    walkSpeed = 1.44;
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
        'assets/images/sprites/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/images/sprites/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/images/sprites/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/images/sprites/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ATTACK = [
        'assets/images/sprites/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/images/sprites/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/images/sprites/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/images/sprites/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/images/sprites/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/images/sprites/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/images/sprites/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/images/sprites/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'assets/images/sprites/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/images/sprites/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/images/sprites/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'assets/images/sprites/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/images/sprites/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/images/sprites/4_enemie_boss_chicken/5_dead/G26.png'
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
            if (this.isDead()) {
                if (this.currentAnimationSet !== 'dead') {
                    this.stopAnimation();
                    this.playAnimation(this.IMAGES_DEAD, 200);
                    this.currentAnimationSet = 'dead';
                }
            } else if (this.isHurt()) {
                if (this.currentAnimationSet !== 'hurt') {
                    this.stopAnimation();
                    this.playAnimation(this.IMAGES_HURT, 150);
                    this.currentAnimationSet = 'hurt';
                }
            } else if (this.isAboveGround()) {
                if (this.currentAnimationSet !== 'attack') {
                    this.stopAnimation();
                    this.playAnimation(this.IMAGES_ATTACK, 120);
                    this.currentAnimationSet = 'attack';
                }
            } else if (this.isMoving) {
                if (this.currentAnimationSet !== 'walking') {
                    this.stopAnimation();
                    this.playAnimation(this.IMAGES_WALKING, 120);
                    this.currentAnimationSet = 'walking';
                }
            } else {
                if (this.currentAnimationSet !== 'alert') {
                    this.stopAnimation();
                    this.playAnimation(this.IMAGES_ALERT, 150);
                    this.currentAnimationSet = 'alert';
                }
            }
        }, 140);

        // Movement interval
        setInterval(() => {
            if (this.isDead()) {
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
        if (this.isDead() || !this.hitTimeStamp()) return;
        
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
        this.energy = 0;
        this.fallSpeed = -8;
        this.stopAnimation();
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
        this.currentAnimationSet = 'dead';
    }
}