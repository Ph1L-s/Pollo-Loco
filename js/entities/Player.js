class Player extends MovebleObject {
    x = 100;
    y = 150;
    height = 300;
    speed = 15;
    world;
    currentImage = 0;
    animationInterval = null; // <- Wichtig: Referenz auf das laufende Animation-Interval

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
        // Diese Schleife läuft immer und prüft den Input
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
            
                this.startAnimation();
            } else if (!moving && this.animationInterval) {
                
                this.stopAnimation();
            }
            this.world.camera_x = -this.x +100;
        }, 1000 / 60);
    }

    startAnimation() {
        this.animationInterval = setInterval(() => {
            let index = this.currentImage % this.IMAGES_WALKING_PLAYER.length;
            let path = this.IMAGES_WALKING_PLAYER[index];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 100);
    }

    stopAnimation() {
        clearInterval(this.animationInterval);
        this.animationInterval = null;
    }

    
    jump(){}
}
