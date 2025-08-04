class Player extends ObjectEntity {
    x = 100;
    y = 40;
    height = 300;
    speed = 4;
    world;


    IMAGES_DEFAULT_PLAYER = [
        'assets/images/sprites/2_character_pepe/3_jump/J-31.png'
    ];

    IMAGES_WALKING_PLAYER = [
        'assets/images/sprites/2_character_pepe/2_walk/W-21.png',
        'assets/images/sprites/2_character_pepe/2_walk/W-22.png',
        'assets/images/sprites/2_character_pepe/2_walk/W-23.png',
        'assets/images/sprites/2_character_pepe/2_walk/W-24.png',
        'assets/images/sprites/2_character_pepe/2_walk/W-25.png',
        'assets/images/sprites/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING_PLAYER = [
        'assets/images/sprites/2_character_pepe/3_jump/J-32.png',
        'assets/images/sprites/2_character_pepe/3_jump/J-33.png',
        'assets/images/sprites/2_character_pepe/3_jump/J-34.png',
        'assets/images/sprites/2_character_pepe/3_jump/J-35.png',
        'assets/images/sprites/2_character_pepe/3_jump/J-36.png',
        'assets/images/sprites/2_character_pepe/3_jump/J-37.png',
        'assets/images/sprites/2_character_pepe/3_jump/J-38.png',
        'assets/images/sprites/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_HURT_PLAYER = [
        'assets/images/sprites/2_character_pepe/4_hurt/H-41.png',
        'assets/images/sprites/2_character_pepe/4_hurt/H-42.png',
        'assets/images/sprites/2_character_pepe/4_hurt/H-43.png'
    ]

    IMAGES_IDL_SHORT_PLAYER = [
        'assets/images/sprites/2_character_pepe/1_idle/idle/I-1.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/I-2.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/I-3.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/I-3.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/I-4.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/I-5.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/I-6.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/I-7.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/I-8.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/I-9.png',
        'assets/images/sprites/2_character_pepe/1_idle/idle/I-10.png'
    ];
    
    IMAGES_IDL_LONG_PLAYER = [
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/I-11.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/I-12.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/I-14.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/I-15.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/I-16.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/I-17.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/I-18.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/I-19.png',
        'assets/images/sprites/2_character_pepe/1_idle/long_idle/I-20.png'
    ];


    IMAGES_DEAD_PLAYER = [
        'assets/images/sprites/2_character_pepe/5_dead/D-51.png',
        'assets/images/sprites/2_character_pepe/5_dead/D-52.png',
        'assets/images/sprites/2_character_pepe/5_dead/D-53.png',
        'assets/images/sprites/2_character_pepe/5_dead/D-54.png',
        'assets/images/sprites/2_character_pepe/5_dead/D-55.png',
        'assets/images/sprites/2_character_pepe/5_dead/D-56.png',
        'assets/images/sprites/2_character_pepe/5_dead/D-57.png'
    ];

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
        setTimeout(() => this.animate(), 50);
    }

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
            if ((this.world.input.SPACE || this.world.input.UP) && !this.isAboveGround()) {
                this.speedY = 14;
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
            else if (this.isAboveGround()) {
                if (this.currentAnimationSet !== 'jump') {
                    console.log('Starting jump animation, speedY:', this.speedY);
                    this.playAnimation(this.IMAGES_JUMPING_PLAYER, 70);
                    this.currentAnimationSet = 'jump';
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
        }, 1000 / 144);
    }

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
                
                // game over screen
                setTimeout(() => {
                    showGameOver();
                }, 1000);
            }
        }, 1000 / 144);
    }
}
