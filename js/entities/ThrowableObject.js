/**
 * @class ThrowableObject
 * @extends ObjectEntity
 * @summary projectile bottle with physics-based throwing, rotation animation, and splash effects
 * @description handles bottle throwing mechanics, rotation during flight, splash on impact
 */
class ThrowableObject extends ObjectEntity {
    /**
     * @summary initializes throwable bottle with position, direction, and physics properties
     * @description sets up bottle projectile with directional throwing, gravity, and animation frames
     * @param {number} x - initial horizontal position for bottle spawn
     * @param {number} y - initial vertical position for bottle spawn
     * @param {boolean} otherDirection - true for left throw, false for right throw
     */
    constructor(x, y, otherDirection) {
        super();
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.otherDirection = otherDirection;
        this.speedX = otherDirection ? -15 : 15;
        this.speedY = 0;
        this.gravity = 0.5;
        this.straightDistance = 200;
        this.distanceTraveled = 0;
        this.currentFrame = 0;
        this.isSplashing = false;
        this.splashFrame = 0;
        this.opacity = 1;
        this.shouldRemove = false;
        
        this.BOTTLE_IMAGES = [
            'assets/images/sprites/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
            'assets/images/sprites/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
            'assets/images/sprites/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
            'assets/images/sprites/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
        ];
        
        this.SPLASH_IMAGES = [
            'assets/images/sprites/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
            'assets/images/sprites/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
            'assets/images/sprites/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
            'assets/images/sprites/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
            'assets/images/sprites/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
            'assets/images/sprites/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
        ];
        
        this.loadImages(this.BOTTLE_IMAGES);
        this.loadImages(this.SPLASH_IMAGES);
        this.loadImage(this.BOTTLE_IMAGES[0]);
        this.throw();
        this.animate();
    }

    /**
     * @summary applies physics-based throwing motion with horizontal movement and gravity
     * @description moves bottle horizontally first, then applies gravity after straight distance
     */
    throw() {
        setInterval(() => {
            if (!this.isSplashing) {
                this.x += this.speedX;
                this.distanceTraveled += Math.abs(this.speedX);
                
                if (this.distanceTraveled > this.straightDistance) {
                    this.speedY += this.gravity;
                }
                
                this.y += this.speedY;
                
                if (this.y >= 380) {
                    this.y = 380;
                    this.isSplashing = true;
                    this.speedX = 0;
                    this.speedY = 0;
                }
            }
        }, 25);
    }

    /**
     * @summary manages bottle rotation during flight and splash animation on impact
     * @description cycles through rotation frames while flying, plays splash sequence on ground hit
     */
    animate() {
        setInterval(() => {
            if (!this.isSplashing) {
                this.currentFrame = (this.currentFrame + 1) % this.BOTTLE_IMAGES.length;
                let imagePath = this.BOTTLE_IMAGES[this.currentFrame];
                if (this.imageCache[imagePath]) {
                    this.img = this.imageCache[imagePath];
                }
            } else {
                if (this.splashFrame < this.SPLASH_IMAGES.length) {
                    let imagePath = this.SPLASH_IMAGES[this.splashFrame];
                    if (this.imageCache[imagePath]) {
                        this.img = this.imageCache[imagePath];
                    }
                    this.splashFrame++;
                } else {
                    this.opacity -= 0.05;
                    if (this.opacity <= 0) {
                        this.shouldRemove = true;
                    }
                }
            }
        }, 100);
    }

    /**
     * @summary custom rendering method with opacity control for fade-out effect
     * @description draws bottle with alpha transparency during splash fade-out sequence
     * @param {CanvasRenderingContext2D} ctx - canvas rendering context for drawing
     */
    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            ctx.restore();
        }
    }
}