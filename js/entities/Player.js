/**
 * @class Player
 * @extends ObjectEntity
 * @summary main player character class with movement, animations, and physics
 * @description handles player input, state management, animations, and death mechanics
 */
class Player extends ObjectEntity {
    x = 100;
    y = 40;
    height = 300;
    speed = 4;
    world;


    IMAGES_DEFAULT_PLAYER = [
        'assets/images/sprites/2_character_pepe/3_jump/j_31.png'
    ];

    IMAGES_WALKING_PLAYER = [
        'assets/images/sprites/2_character_pepe/2_walk/w_21.png',
        'assets/images/sprites/2_character_pepe/2_walk/w_22.png',
        'assets/images/sprites/2_character_pepe/2_walk/w_23.png',
        'assets/images/sprites/2_character_pepe/2_walk/w_24.png',
        'assets/images/sprites/2_character_pepe/2_walk/w_25.png',
        'assets/images/sprites/2_character_pepe/2_walk/w_26.png'
    ];

    IMAGES_JUMPING_PLAYER = [
        'assets/images/sprites/2_character_pepe/3_jump/j_32.png',
        'assets/images/sprites/2_character_pepe/3_jump/j_33.png',
        'assets/images/sprites/2_character_pepe/3_jump/j_34.png',
        'assets/images/sprites/2_character_pepe/3_jump/j_35.png',
        'assets/images/sprites/2_character_pepe/3_jump/j_36.png',
        'assets/images/sprites/2_character_pepe/3_jump/j_37.png',
        'assets/images/sprites/2_character_pepe/3_jump/j_38.png',
        'assets/images/sprites/2_character_pepe/3_jump/j_39.png'
    ];

    IMAGES_HURT_PLAYER = [
        'assets/images/sprites/2_character_pepe/4_hurt/h_41.png',
        'assets/images/sprites/2_character_pepe/4_hurt/h_42.png',
        'assets/images/sprites/2_character_pepe/4_hurt/h_43.png'
    ]

    IMAGES_IDL_SHORT_PLAYER = [
        'assets/images/sprites/2_character_pepe/1_idle/idle/i_1.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/i_2.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/i_3.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/i_3.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/i_4.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/i_5.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/i_6.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/i_7.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/i_8.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/i_9.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/i_10.png'
    ];
    
    IMAGES_IDL_LONG_PLAYER = [
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_11.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_12.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_13.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_13.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_14.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_15.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_16.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_17.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_18.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_19.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/i_20.png'
    ];


    IMAGES_DEAD_PLAYER = [
        'assets/images/sprites/2_character_pepe/5_dead/d_51.png',
        'assets/images/sprites/2_character_pepe/5_dead/d_52.png',
        'assets/images/sprites/2_character_pepe/5_dead/d_53.png',
        'assets/images/sprites/2_character_pepe/5_dead/d_54.png',
        'assets/images/sprites/2_character_pepe/5_dead/d_55.png',
        'assets/images/sprites/2_character_pepe/5_dead/d_56.png',
        'assets/images/sprites/2_character_pepe/5_dead/d_57.png'
    ];

    /**
     * @summary initializes player with sprite animations and physics
     * @description loads all animation sprite sets, applies gravity, sets initial state flags
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING_PLAYER[0]); 
        this.loadImages(this.IMAGES_DEFAULT_PLAYER);
        this.loadImages(this.IMAGES_WALKING_PLAYER);
        this.loadImages(this.IMAGES_JUMPING_PLAYER);
        this.loadImages(this.IMAGES_DEAD_PLAYER);
        this.loadImages(this.IMAGES_HURT_PLAYER);
        this.loadImages(this.IMAGES_IDL_SHORT_PLAYER);
        this.loadImages(this.IMAGES_IDL_LONG_PLAYER);
        this.applyGravity();
        this.lastActionTime = Date.now();
        this.deathAnimationStarted = false;
        this.isJumping = false;
        this.isKnockedBack = false;
        setTimeout(() => this.animate(), 50);
    }

    /**
     * @summary main animation and input handling loop for player character
     * @description processes input, manages state transitions, handles animations, and updates camera
     */
    animate() {
        setInterval(() => {
            if (!this.world || !this.world.input) return;
            
            if (this.isDead()) {
                if (!this.deathAnimationStarted) {
                    console.log('starting death fall');
                    this.startDeathFall();
                    this.deathAnimationStarted = true;
                    this.currentAnimationSet = 'dead';
                }
                return;
            }
            
            this.moving = false;
            let hasInput = false;
            
            if (!this.isKnockedBack) {
                if (this.world.input.RIGHT && this.x < this.world.level.level_end_x) {
                    this.moveRight();
                    this.moving = true;
                    hasInput = true;
                }
                if (this.world.input.LEFT && this.x > 120) {
                    this.moveLeft();
                    this.moving = true;
                    hasInput = true;
                }
            }
            if ((this.world.input.SPACE || this.world.input.UP) && !this.isAboveGround()) {
                this.speedY = 10;
                this.isJumping = true;
                hasInput = true;
            }
            
            if (hasInput || this.moving || this.isAboveGround() || this.isHurt()) {
                this.lastActionTime = Date.now();
            }

            if (this.isHurt()) {
                if (this.currentAnimationSet !== 'hurt') {
                    this.playAnimation(this.IMAGES_HURT_PLAYER, 200);
                    this.currentAnimationSet = 'hurt';
                }
            } 
            else if (this.isAboveGround() || this.isJumping) {
                if (this.currentAnimationSet !== 'jump') {
                    this.playAnimation(this.IMAGES_JUMPING_PLAYER, 200);
                    this.currentAnimationSet = 'jump';
                }
                
                if (!this.isAboveGround() && this.speedY <= 0) {
                    this.isJumping = false;
                }
            } 
            else if (this.moving) {
                if (this.currentAnimationSet !== 'walk') {
                    this.playAnimation(this.IMAGES_WALKING_PLAYER, 120);
                    this.currentAnimationSet = 'walk';
                }
            } 
            else {
                const timeSinceLastAction = Date.now() - this.lastActionTime;
                
                if (timeSinceLastAction >= 1000) { 
                    if (this.currentAnimationSet !== 'idleLong') {
                        this.playAnimation(this.IMAGES_IDL_LONG_PLAYER, 200);
                        this.currentAnimationSet = 'idleLong';
                    }
                } else if (timeSinceLastAction >= 500) {
                    if (this.currentAnimationSet !== 'idleShort') {
                        this.playAnimation(this.IMAGES_IDL_SHORT_PLAYER, 200);
                        this.currentAnimationSet = 'idleShort';
                    }
                } else if (timeSinceLastAction >= 400) { 
                    if (this.currentAnimationSet !== 'default') {
                        this.stopAnimation();
                        this.loadImage(this.IMAGES_DEFAULT_PLAYER[0]);
                        this.currentAnimationSet = 'default';
                    }
                } else {
                    this.stopAnimation();
                    this.currentAnimationSet = null;
                    this.loadImage(this.IMAGES_WALKING_PLAYER[0]);
                }
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 64);
    }

    /**
     * @summary initiates death falling animation with accelerating physics
     * @description loads death sprite, applies downward velocity, triggers game over when off screen
     */
    startDeathFall() {
        console.log('startDeathFall() called');
        this.stopAnimation();
        
        this.loadImage(this.IMAGES_DEAD_PLAYER[0]);
        
        this.speedY = 10; 
        this.deathFallSpeed = 0;
        
        this.deathFallInterval = setInterval(() => {
            this.y += this.deathFallSpeed;
            this.deathFallSpeed += 0.3; 
            if (this.y > 600) {
                clearInterval(this.deathFallInterval);
                console.log('Player fell out of world');
                
                setTimeout(() => {
                    showGameOver();
                }, 1000);
            }
        }, 1000 / 64);
    }
}
