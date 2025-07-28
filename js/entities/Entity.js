class MovebleObject {
    x = 120;
    y = 150;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    speed = 0.15;
    otherDirection = false;
    animationInterval = null;
    currentImage = 0;

    loadImage(path){
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr){
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    playAnimation(images, interval = 100) {
        this.stopAnimation();
        this.animationInterval = setInterval(() => {
            let index = this.currentImage % images.length;
            let path = images[index];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, interval);
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    moveRight(){
        console.log('moving right');
    }

    moveLeft(){
        setInterval( () =>{
            this.x -= this.speed;
        }, 1000 / 144);
    }
}
