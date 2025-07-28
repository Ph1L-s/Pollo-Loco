class Cloud extends ObjectEntity {
    x = 120;
    y = 10;
    width = 650;
    height = 320;
    img;

    constructor(){
        super().loadImage('assets/images/backgrounds/layers/4_clouds/1.png');
        this.animate();
    }

    animate(){
        this.moveLeft();
        
    }

    moveRight(){

    }
    
    moveLeft(){

    }

}