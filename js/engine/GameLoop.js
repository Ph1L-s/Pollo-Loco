/**
 * @class GameLoop
 * @summary main game loop system managing update and render phases with timing
 * @description provides centralized loop with delta time calculation and callback system
 */
class GameLoop {
    /**
     * @summary initializes game loop with timing and callback management
     * @description sets up loop state, timing tracking, and callback arrays for update/render phases
     */
    constructor() {
        this.isRunning = false;
        this.lastTime = 0;
        this.updateCallbacks = [];
        this.renderCallbacks = [];
    }

    /**
     * @summary starts game loop execution with timing initialization
     * @description activates loop, records start time, begins animation frame cycle
     */
    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop();
    }

    /**
     * @summary stops game loop execution
     * @description deactivates loop flag to halt animation frame cycle
     */
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * @summary main loop iteration handling timing, update phase, and render phase
     * @description calculates delta time, executes callbacks, schedules next frame with Safari optimizations
     */
    loop() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        let deltaTime = currentTime - this.lastTime;
        
        deltaTime = Math.min(deltaTime, 33.33);
        
        this.lastTime = currentTime;

        this.updateCallbacks.forEach(callback => callback(deltaTime));
        
        if (this.renderCallbacks.length > 0) {
            this.renderCallbacks.forEach(callback => callback(deltaTime));
        }
        this.animationId = requestAnimationFrame(() => this.loop());
    }

    /**
     * @summary registers callback function for update phase execution
     * @description adds function to be called during update phase with delta time
     * @param {Function} callback - function to call during update phase
     */
    addUpdateCallback(callback) {
        this.updateCallbacks.push(callback);
    }

    /**
     * @summary registers callback function for render phase execution
     * @description adds function to be called during render phase with delta time
     * @param {Function} callback - function to call during render phase
     */
    addRenderCallback(callback) {
        this.renderCallbacks.push(callback);
    }
}