class BackgroundObject extends MovebleObject{

    width = 720;
    height = 480;
    constructor(imagePath, x,){
        super().loadImage(imagePath);


        this.x = 720 - this.width;
        this.y = 480 - this.height; 
        
    }



}