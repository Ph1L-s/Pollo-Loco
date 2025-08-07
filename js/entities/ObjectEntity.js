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
     * @summary determines if entity should display collision boundary for debugging
     * @description checks if entity type should show collision visualization
     * @returns {boolean} true for player, enemy, and boss entities
     */
    shouldShowCollision() {
        return this instanceof Player || 
               this instanceof Enemy || 
               this instanceof BossEntity;
    }

    /**
     * @summary renders collision boundary rectangle for debugging purposes
     * @description draws blue outline around entity hitbox when collision display is enabled
     * @param {CanvasRenderingContext2D} ctx - canvas rendering context
     */
    drawCollision(ctx) {
        if (!this.shouldShowCollision() || !this.showCollision) return;
        ctx.beginPath();
        ctx.lineWidth = '1';
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    /**
     * @summary toggles collision boundary visualization for debugging
     * @description enables or disables collision box display for eligible entities
     * @param {boolean} show - whether to show collision boundaries
     */
    toggleCollision(show) {
        if (this.shouldShowCollision()) {
            this.showCollision = show;
        }
    }

    /**
     * @summary basic collision detection using axis-aligned bounding box
     * @description checks if this entity overlaps with another entity's rectangular bounds
     * @param {ObjectEntity} mo - other entity to test collision against
     * @returns {boolean} true if entities are colliding
     */
    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height;
    }

    /**
     * @summary applies damage to entity and handles death state
     * @description reduces energy by 5, clamps to zero, records hit time for hurt animation
     */
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
            
            if (this.speedX !== 0) {
                this.x += this.speedX;
                this.speedX *= this.horizontalFriction;
                
                if (Math.abs(this.speedX) < 0.1) {
                    this.speedX = 0;
                    if (this instanceof Player) {
                        this.isKnockedBack = false;
                    }
                }
            }
            
            if (this instanceof Player && this.isKnockedBack && !this.isAboveGround() && this.speedY <= 0 && this.speedX === 0) {
                this.isKnockedBack = false;
            }
        }, 1000 / 64);
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
        if (this instanceof Player) {
            console.log('Player animation:', images.length, 'frames');
        } else if (this instanceof Enemy || this instanceof BossEntity) {
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
        if (this instanceof Player) {
            this.otherDirection = true;
        }
        this.moving = true;
    }
}

window.ObjectEntity = ObjectEntity;