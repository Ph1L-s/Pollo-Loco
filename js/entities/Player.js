class Player extends MovebleObject {
    x = 100;
    y = 60;
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

    constructor(){
        super().loadImage(this.IMAGES_WALKING_PLAYER[0]);
        this.loadImages(this.IMAGES_WALKING_PLAYER);
        this.startMovementLoop();
    }

    startMovementLoop() {
        setInterval(() => {
            let moving = false;

            if (this.world.input.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
                moving = true;
            }
            if (this.world.input.LEFT && this.x > 100) {
                this.x -= this.speed;
                this.otherDirection = true;
                moving = true;
            }

            if (moving && !this.animationInterval) {
                this.playAnimation(this.IMAGES_WALKING_PLAYER, 100);
            } else if (!moving && this.animationInterval) {
                this.stopAnimation();
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 144);
    }
}
