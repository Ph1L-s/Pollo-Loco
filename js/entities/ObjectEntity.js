class ObjectEntity extends DrawableObjects {
    speed = 0.15;
    otherDirection = false;
    animationInterval = null;
    speedY = 0;
    acceleration = 0.5;
    currentAnimationSet = null;
    energy = 100;
    lastHit = 0;

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

    isColliding(mo) {
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
            console.log('player dead!');
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        return timepassed < 500; 
    }

    isDead() {
        return this.energy == 0;
    }

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                
                let groundLevel = 120; 
                if (this instanceof ThrowableObject) {
                    groundLevel = 380; 
                }
                
                if (this.y > groundLevel) {
                    this.y = groundLevel;
                    this.speedY = 0;
                }
            }
        }, 1000 / 144);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 120;
        }
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    playAnimation(images, interval = 100) {
        // Clean log only when animation starts
        if (this instanceof Player) {
            console.log('Player animation:', images.length, 'frames');
        } else if (this instanceof Enemy || this instanceof BossEntity) {
            console.log(`${this.constructor.name} animation started`);
        }
        
        this.stopAnimation();
        this.currentImage = 0; // Reset animation to start from frame 0
        this.animationInterval = setInterval(() => {
            let index = this.currentImage % images.length;
            let path = images[index];
            if (this.imageCache[path]) {
                this.img = this.imageCache[path];
            } else {
                console.log('Missing from cache:', path);
            }
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

window.ObjectEntity = ObjectEntity;