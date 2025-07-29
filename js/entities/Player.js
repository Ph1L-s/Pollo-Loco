class Player extends ObjectEntity {
    x = 100;
    y = 40;
    height = 300;
    speed = 4;
    world;


    IMAGES_WALKING_PLAYER = [
        'assets/images/sprites/2_character_pepe/2_walk/W-21.png',
        'assets/images/sprites/2_character_pepe/2_walk/W-22.png',
        'assets/images/sprites/2_character_pepe/2_walk/W-23.png',
        'assets/images/sprites/2_character_pepe/2_walk/W-24.png',
        'assets/images/sprites/2_character_pepe/2_walk/W-25.png',
        'assets/images/sprites/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING_PLAYER = [
        'assets/images/sprites/2_character_pepe/3_jump/J-31.png',
        'assets/images/sprites/2_character_pepe/3_jump/J-32.png',
        'assets/images/sprites/2_character_pepe/3_jump/J-33.png',
        'assets/images/sprites/2_character_pepe/3_jump/J-34.png',
        'assets/images/sprites/2_character_pepe/3_jump/J-35.png',
        'assets/images/sprites/2_character_pepe/3_jump/J-36.png',
        'assets/images/sprites/2_character_pepe/3_jump/J-37.png',
        'assets/images/sprites/2_character_pepe/3_jump/J-38.png',
        'assets/images/sprites/2_character_pepe/3_jump/J-39.png'
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

    IMAGES_HURT_PLAYER = [
        'assets/images/sprites/2_character_pepe/4_hurt/H-41.png',
        'assets/images/sprites/2_character_pepe/4_hurt/H-42.png',
        'assets/images/sprites/2_character_pepe/4_hurt/H-43.png'
    ]
    
    constructor() {
        super().loadImage(this.IMAGES_WALKING_PLAYER[0]); 
        this.loadImages(this.IMAGES_WALKING_PLAYER);
        this.loadImages(this.IMAGES_JUMPING_PLAYER);
        this.loadImages(this.IMAGES_DEAD_PLAYER);
        this.loadImages(this.IMAGES_HURT_PLAYER);
        this.applyGravity();
        setTimeout(() => this.animate(), 50);
    }

    animate() {
        setInterval(() => {
            if (!this.world || !this.world.input) return;
            
            // 1. Tod hat höchste Priorität
            if (this.isDead()) {
                if (this.currentAnimationSet !== 'dead') {
                    this.playAnimation(this.IMAGES_DEAD_PLAYER, 200);
                    this.currentAnimationSet = 'dead';
                }
                return;
            }
            
            // 2. Bewegungseingaben verarbeiten
            this.moving = false;
            if (this.world.input.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.moving = true;
            }
            if (this.world.input.LEFT && this.x > 120) {
                this.moveLeft();
                this.moving = true;
            }
            if ((this.world.input.SPACE || this.world.input.UP) && !this.isAbouveGround()) {
                this.speedY = 14;
            }

            // 3. Animationen steuern
            if (this.isHurt()) {
                if (this.currentAnimationSet !== 'hurt') {
                    this.playAnimation(this.IMAGES_HURT_PLAYER, 200);
                    this.currentAnimationSet = 'hurt';
                }
            } 
            else if (this.isAbouveGround()) {
                if (this.currentAnimationSet !== 'jump') {
                    this.playAnimation(this.IMAGES_JUMPING_PLAYER, 120);
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
                this.stopAnimation();
                this.currentAnimationSet = null;
                this.loadImage(this.IMAGES_WALKING_PLAYER[0]);
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 144);
    }
}
