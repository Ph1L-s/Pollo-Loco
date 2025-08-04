class AnimationManager {
    constructor() {
        this.animations = {};
        this.currentAnimation = null;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDelay = 100; 
    }

    addAnimation(name, frames, loop = true) {
        this.animations[name] = {
            frames: frames,
            loop: loop,
            currentFrame: 0
        };
    }

    playAnimation(name) {
        if (this.currentAnimation !== name) {
            this.currentAnimation = name;
            this.currentFrame = 0;
            this.frameTimer = 0;
        }
    }

    update(deltaTime) {
        if (!this.currentAnimation) return;

        this.frameTimer += deltaTime;
        
        if (this.frameTimer >= this.frameDelay) {
            const animation = this.animations[this.currentAnimation];
            if (animation) {
                this.currentFrame++;
                if (this.currentFrame >= animation.frames.length) {
                    if (animation.loop) {
                        this.currentFrame = 0;
                    } else {
                        this.currentFrame = animation.frames.length - 1;
                    }
                }
            }
            this.frameTimer = 0;
        }
    }

    getCurrentFrame() {
        if (!this.currentAnimation) return null;
        const animation = this.animations[this.currentAnimation];
        return animation ? animation.frames[this.currentFrame] : null;
    }
}