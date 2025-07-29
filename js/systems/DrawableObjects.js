class DrawableObjects {
    x = 120;
    y = 120;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    moving = false;
    currentImage = 0;
    showCollision = false;

    constructor() {}

    shouldShowCollision() {
        return this.showCollision; 
    }

    drawCollision(ctx) {
        if (!this.shouldShowCollision()) return;
        ctx.beginPath();
        ctx.lineWidth = '1';
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    toggleCollision(show) {
        this.showCollision = show;
    }
}


window.DrawableObjects = DrawableObjects;