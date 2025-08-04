class GameLoop {
    constructor() {
        this.isRunning = false;
        this.lastTime = 0;
        this.updateCallbacks = [];
        this.renderCallbacks = [];
    }

    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop();
    }

    stop() {
        this.isRunning = false;
    }

    loop() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // update phase
        this.updateCallbacks.forEach(callback => callback(deltaTime));

        // render phase
        this.renderCallbacks.forEach(callback => callback(deltaTime));

        requestAnimationFrame(() => this.loop());
    }

    addUpdateCallback(callback) {
        this.updateCallbacks.push(callback);
    }

    addRenderCallback(callback) {
        this.renderCallbacks.push(callback);
    }
}