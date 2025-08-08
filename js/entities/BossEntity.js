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
    speed = 2.88;
    walkSpeed = 2.88;
    lastHitTimeStamp = 0;
    isMoving = false;
    isCharging = false;
    isAlerting = false;
    chargeSpeed = 17.28;
    alertStartTime = 0;
    alertDuration = 1500;
    chargeDuration = 2000;
    hitCount = 0;
    baseChargeChance = 0.01;
    chargeChanceIncrease = 0.05;
    lowHealthChargeChance = 0.25;

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
        
        setTimeout(() => {
            this.world = window.world;
        }, 100);
    }

    /**
     * @summary initializes boss AI behavior systems and animation loops
     * @description sets up animation and movement intervals, manages state transitions between alert, charge, and normal behavior
     */
    startBossLogic() {
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
            } else if (this.isAlerting) {
                if (this.currentAnimationSet !== 'alert') {
                    this.stopAnimation();
                    this.playAnimation(this.IMAGES_ALERT, 120);
                    this.currentAnimationSet = 'alert';
                }
            } else if (this.isCharging) {
                if (this.currentAnimationSet !== 'attack') {
                    this.stopAnimation();
                    this.playAnimation(this.IMAGES_ATTACK, 80);
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

    /**
     * @summary handles boss movement AI including charge attacks and player tracking
     * @description calculates charge probability based on health and hit count, manages alert-charge sequence, implements intelligent player following
     */
    randomWalk() {
        if (!this.world || !this.world.character) return;
        
        let player = this.world.character;
        let distanceToPlayer = Math.abs(this.x - player.x);
        
        let healthPercentage = this.energy / 100;
        let chargeChance;
        
        if (healthPercentage <= 0.2) {
            chargeChance = this.lowHealthChargeChance;
        } else {
            chargeChance = this.baseChargeChance + (this.hitCount * this.chargeChanceIncrease);
        }
        
        if (!this.isCharging && !this.isAlerting && !this.isMoving && distanceToPlayer < 800 && Math.random() < chargeChance) {
            this.startAlertSequence();
            return;
        }

        if (this.isAlerting) {
            let currentTime = new Date().getTime();
            if (currentTime - this.alertStartTime > this.alertDuration) {
                this.isAlerting = false;
                this.isCharging = true;
            }
            return;
        }

        if (this.isCharging) {
            let currentTime = new Date().getTime();
            let chargeStartTime = this.alertStartTime + this.alertDuration;
            if (currentTime - chargeStartTime < this.chargeDuration) {
                if (this.x > player.x) {
                    this.x -= this.chargeSpeed;
                    this.otherDirection = false;
                } else {
                    this.x += this.chargeSpeed;
                    this.otherDirection = true;
                }
                
                if (this.x < 100) {
                    this.x = 100;
                } else if (this.x > 3900) {
                    this.x = 3900;
                }
            } else {
                this.isCharging = false;
                this.isMoving = false;
            }
            return;
        }

        if (distanceToPlayer < 600) {
            if (this.x > player.x) {
                this.x -= this.walkSpeed;
                this.otherDirection = false;
                this.isMoving = true;
            } else {
                this.x += this.walkSpeed;
                this.otherDirection = true;
                this.isMoving = true;
            }
            
            if (this.x < 100) {
                this.x = 100;
            } else if (this.x > 3900) {
                this.x = 3900;
            }
        } else {
            if (Math.random() < 0.01) {
                this.isMoving = !this.isMoving;
                if (this.isMoving && Math.random() < 0.5) {
                    this.otherDirection = !this.otherDirection;
                }
            }
            if (this.isMoving && !this.isCharging) {
                if (this.otherDirection) {
                    this.x += this.walkSpeed;
                } else {
                    this.x -= this.walkSpeed;
                }
                
                if (this.x < 100) {
                    this.x = 100;
                    this.otherDirection = true;
                } else if (this.x > 3900) {
                    this.x = 3900;
                    this.otherDirection = false;
                }
            }
        }
    }

    /**
     * @summary initiates boss charge attack alert phase
     * @description begins 1.5 second alert animation before charge attack, stops movement during alert
     */
    startAlertSequence() {
        this.isAlerting = true;
        this.isMoving = false;
        this.alertStartTime = new Date().getTime();
    }

    /**
     * @summary applies damage to boss with enhanced charge mechanics
     * @description reduces boss health, increases hit count for charge probability, triggers immediate alert chance, handles death sequence
     * @param {number} damage - amount of damage to apply (default: 20)
     */
    hit(damage = 20) {
        if (this.isDead() || !this.hitTimeStamp()) return;
        
        this.energy -= damage;
        this.lastHitTimeStamp = new Date().getTime();
        this.hitCount++;
        
        let immediateAlertChance = this.energy <= 20 ? this.lowHealthChargeChance : (this.hitCount * this.chargeChanceIncrease);
        
        if (!this.isCharging && !this.isAlerting && this.world && this.world.character) {
            let distanceToPlayer = Math.abs(this.x - this.world.character.x);
            if (distanceToPlayer < 800 && Math.random() < immediateAlertChance) {
                this.startAlertSequence();
            }
        }
        
        if (this.energy <= 0) {
            this.energy = 0;
            this.startFalling();
        }
        
    }

    /**
     * @summary checks if boss can take damage based on invincibility timer
     * @description prevents rapid damage by enforcing 1 second cooldown between hits
     * @returns {boolean} true if boss can be damaged
     */
    hitTimeStamp() {
        return new Date().getTime() - this.lastHitTimeStamp > 1000;
    }

    /**
     * @summary determines if boss is in hurt state for animation
     * @description checks if boss was recently hit and should display hurt animation
     * @returns {boolean} true if boss should show hurt animation
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHitTimeStamp;
        return timepassed < 1000 && this.energy > 0;
    }

    /**
     * @summary checks if boss has been defeated
     * @description determines boss death state for animation and behavior changes
     * @returns {boolean} true if boss energy is zero or below
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * @summary initiates boss death fall sequence
     * @description sets death state, applies upward velocity, switches to death sprite, stops animations
     */
    startFalling() {
        this.energy = 0;
        this.fallSpeed = -8;
        this.stopAnimation();
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
        this.currentAnimationSet = 'dead';
    }
}