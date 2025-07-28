class BackgroundObject extends ObjectEntity {
    width = 720;
    height = 480;

    constructor(imagePath, x = 0, y = 0) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
    }
    
}
