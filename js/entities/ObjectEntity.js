/**
 * @class ObjectEntity
 * @extends DrawableObjects
 * @summary base entity class with physics, animations, collision detection and health system
 * @description provides core functionality for all game entities including movement, gravity, damage
 */
class ObjectEntity extends DrawableObjects {
    speed = 0.15;
    otherDirection = false;
    animationInterval = null;
    speedY = 0;
    speedX = 0;
    acceleration = 0.5;
    horizontalFriction = 0.8;
    currentAnimationSet = null;
    energy = 100;
    lastHit = 0;

    /**
     * @summary renders optimized collision boundary with color coding
     * @description draws collision rectangle with entity-specific colors and transparency
     * @param {CanvasRenderingContext2D} ctx - canvas rendering context
     */
    drawCollision(ctx) {
        if (!this.showCollision) return;
        
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 2;
        
        if (this.constructor.name === 'Player') {
            ctx.strokeStyle = 'blue';
            ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
        } else if (this.constructor.name === 'Enemy') {
            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        } else if (this.constructor.name === 'BossEntity') {
            ctx.strokeStyle = 'orange';
            ctx.fillStyle = 'rgba(255, 165, 0, 0.1)';
        } else {
            ctx.strokeStyle = 'green';
            ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        }
        
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }

    /**
     * @summary toggles collision boundary visualization for debugging
     * @description enables or disables collision box display
     * @param {boolean} show - whether to show collision boundaries
     */
    toggleCollision(show) {
        this.showCollision = show;
    }

    /**
     * @summary optimized collision detection using axis-aligned bounding box
     * @description checks if this entity overlaps with another entity with early exit optimization
     * @param {ObjectEntity} mo - other entity to test collision against
     * @returns {boolean} true if entities are colliding
     */
    isColliding(mo) {
        if (!mo) return false;
        
        return this.x < mo.x + mo.width &&
               this.x + this.width > mo.x &&
               this.y < mo.y + mo.height &&
               this.y + this.height > mo.y;
    }

    /**
     * @summary calculates collision overlap for physics resolution
     * @description determines overlap distance on both axes for separation
     * @param {ObjectEntity} other - other entity to calculate overlap with
     * @returns {Object} object with overlapX and overlapY properties
     */
    getCollisionOverlap(other) {
        if (!this.isColliding(other)) return { overlapX: 0, overlapY: 0 };
        
        let overlapX = Math.min(
            this.x + this.width - other.x,
            other.x + other.width - this.x
        );
        
        let overlapY = Math.min(
            this.y + this.height - other.y,
            other.y + other.height - this.y
        );
        
        return { overlapX, overlapY };
    }

    /**
     * @summary applies damage to entity and handles death state
     * @description reduces energy by 5, clamps to zero, records hit time for hurt animation
     */
    hit() {
        if (this.isDead()) return;
        
        this.lastHit = new Date().getTime();
        this.energy -= 5;
        
        if (this.energy <= 0) {
            this.energy = 0;
            console.log('player dead!');
        }
        
    }

    /**
     * @summary checks if entity is currently in hurt state for animation purposes
     * @description determines if enough time has passed since last hit for hurt animation
     * @returns {boolean} true if entity was hit within last 500ms
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        return timepassed < 500; 
    }

    /**
     * @summary checks if entity has zero health remaining
     * @description determines death state based on energy level
     * @returns {boolean} true if entity is dead (energy = 0)
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * @summary applies physics simulation including gravity and horizontal knockback
     * @description handles vertical falling with ground collision and horizontal movement with friction
     */
    applyGravity() {
        if (this.gravityInterval) return;
        
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                
                let groundLevel = 120; 
                if (this.constructor.name === 'ThrowableObject') {
                    groundLevel = 380; 
                }
                
                if (this.y > groundLevel) {
                    this.y = groundLevel;
                    this.speedY = 0;
                }
            }
            
            if (this.speedX !== 0) {
                this.x += this.speedX;
                
                // Map boundaries for Player
                if (this.constructor.name === 'Player') {
                    if (this.x < 50) {
                        this.x = 50;
                        this.speedX = 0;
                        this.isKnockedBack = false;
                    }
                    if (this.x > 2500) {
                        this.x = 2500;
                        this.speedX = 0;
                        this.isKnockedBack = false;
                    }
                }
                
                this.speedX *= this.horizontalFriction;
                
                if (Math.abs(this.speedX) < 0.1) {
                    this.speedX = 0;
                    if (this.constructor.name === 'Player') {
                        this.isKnockedBack = false;
                    }
                }
            }
            
            if (this.constructor.name === 'Player' && this.isKnockedBack && !this.isAboveGround() && this.speedY <= 0 && this.speedX === 0) {
                this.isKnockedBack = false;
            }
        }, 16); // Optimiert: 60 FPS statt 64 FPS
    }

    /**
     * @summary checks if entity is above ground level for gravity application
     * @description determines ground collision for physics system with different rules for throwables
     * @returns {boolean} true if entity should be affected by gravity
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 120;
        }
    }

    /**
     * @summary loads single image sprite for entity display
     * @description creates image object and sets source path for rendering
     * @param {string} path - relative path to image file
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * @summary starts looping animation sequence from sprite image array
     * @description stops current animation, cycles through image frames at specified interval
     * @param {Array<string>} images - array of image paths for animation frames
     * @param {number} interval - milliseconds between frame changes (default 100)
     */
    playAnimation(images, interval = 100) {
        if (this.constructor.name === 'Player') {
            console.log('Player animation:', images.length, 'frames');
        } else if (this.constructor.name === 'Enemy' || this.constructor.name === 'BossEntity') {
            console.log(`${this.constructor.name} animation started`);
        }
        
        this.stopAnimation();
        this.currentImage = 0;
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

    /**
     * @summary stops currently running animation sequence
     * @description clears animation interval and resets animation state
     */
    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    /**
     * @summary moves entity horizontally to the right
     * @description updates x position, sets facing direction, marks as moving
     */
    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
        this.moving = true;
    }

    /**
     * @summary moves entity horizontally to the left
     * @description updates x position, sets facing direction for players, marks as moving
     */
    moveLeft() {
        this.x -= this.speed;
        if (this.constructor.name === 'Player') {
            this.otherDirection = true;
        }
        this.moving = true;
    }
}

window.ObjectEntity = ObjectEntity;