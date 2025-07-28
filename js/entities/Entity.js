class ObjectEntity {
    x = 120;
    y = 120;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    speed = 0.15;
    moving = false;
    otherDirection = false;
    animationInterval = null;
    currentImage = 0;
    speedY = 0;
    acceleration = 0.5;
    currentAnimationSet = null;
    showCollision = false;
    energy = 100;


    shouldShowCollision() {
        return this instanceof Player || 
               this instanceof Enemy || 
               this instanceof BossEntity;
    }

    drawCollision(ctx) {
        if (!this.shouldShowCollision() || !this.showCollision) return;
        ctx.beginPath();
        ctx.lineWidth = '1';
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    toggleCollision(show) {
        if (this.shouldShowCollision()) {
            this.showCollision = show;
        }
    }

    isColliding(mo){
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x &&
            this.y < mo.y + mo.height;
    }

    hit() {
        if (this.isDead()) return;
        
        this.energy -= 5;
        if (this.energy <= 0) {
            this.energy = 0;
            console.log('Player dead!');
        }
    }

    isDead(){
        return this.energy == 0;
    }

    applyGravity() {
        setInterval(() => {
            if (this.isAbouveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                if (this.y > 120) {
                    this.y = 120;
                    this.speedY = 0;
                }
            }
        }, 1000 / 144);
    }

    isAbouveGround() {
        return this.y < 120;
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
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

    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
        this.moving = true;
    }

    moveLeft() {
        this.x -= this.speed;
        if (this instanceof Player) {
            this.otherDirection = true;
        }
        this.moving = true;
    }
}