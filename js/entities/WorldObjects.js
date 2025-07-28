class Cloud extends MovebleObject {
    x = 120;
    y = 10;
    width = 650;
    height = 320;
    img;

    constructor(){
        super().loadImage('assets/images/backgrounds/layers/4_clouds/1.png');
        //this.img.src = path;
        this.animate();
    }

    animate(){
        this.moveLeft();
        
    }

    moveRight(){
        console.log('Moving right');
    }

}