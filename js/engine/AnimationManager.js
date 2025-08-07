/**
 * @class AnimationManager
 * @summary centralized animation system managing frame sequences and timing
 * @description handles animation registration, playback, frame timing, and looping logic
 */
class AnimationManager {
    /**
     * @summary initializes animation manager with timing and frame tracking
     * @description sets up animation storage, frame counters, and default timing values
     */
    constructor() {
        this.animations = {};
        this.currentAnimation = null;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDelay = 100; 
    }

    /**
     * @summary registers new animation sequence with name and frame configuration
     * @description stores animation data with frame array, looping behavior, and state tracking
     * @param {string} name - unique identifier for animation sequence
     * @param {Array<string>} frames - array of image paths for animation frames
     * @param {boolean} loop - whether animation should loop when reaching end (default true)
     */
    addAnimation(name, frames, loop = true) {
        this.animations[name] = {
            frames: frames,
            loop: loop,
            currentFrame: 0
        };
    }

    /**
     * @summary starts playing specified animation sequence from beginning
     * @description switches to new animation, resets frame counter and timing
     * @param {string} name - name of registered animation to play
     */
    playAnimation(name) {
        if (this.currentAnimation !== name) {
            this.currentAnimation = name;
            this.currentFrame = 0;
            this.frameTimer = 0;
        }
    }

    /**
     * @summary advances animation frame based on delta time and handles looping
     * @description updates frame timer, advances to next frame when delay reached, handles loop logic
     * @param {number} deltaTime - milliseconds elapsed since last update
     */
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

    /**
     * @summary retrieves current animation frame image path for rendering
     * @description returns active frame path or null if no animation playing
     * @returns {string|null} image path for current frame or null if no animation
     */
    getCurrentFrame() {
        if (!this.currentAnimation) return null;
        const animation = this.animations[this.currentAnimation];
        return animation ? animation.frames[this.currentFrame] : null;
    }
}