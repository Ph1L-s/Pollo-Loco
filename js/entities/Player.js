class Player extends MovebleObject {
    x = 100;
    y = 150;
    height = 300;
    IMAGES_WALKING_PLAYER = [
        'assets/images/sprites/2_character_pepe/2_walk/W-21.png',
        'assets/images/sprites/2_character_pepe/2_walk/W-22.png',
        'assets/images/sprites/2_character_pepe/2_walk/W-23.png',
        'assets/images/sprites/2_character_pepe/2_walk/W-24.png',
        'assets/images/sprites/2_character_pepe/2_walk/W-25.png',
        'assets/images/sprites/2_character_pepe/2_walk/W-26.png'
    ];

    currentImage = 0;


    constructor(){
        super().loadImage('assets/images/sprites/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING_PLAYER);
        this.animate();
    }
    animate(){
 
        setInterval(() => {
            let indexPlayer = this.currentImage % this.IMAGES_WALKING_PLAYER.length;
            let path = this.IMAGES_WALKING_PLAYER[indexPlayer];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 100);


        

    }

    jump(){}
}
