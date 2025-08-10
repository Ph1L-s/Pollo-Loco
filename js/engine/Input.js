/**
 * @class Input
 * @summary input management system handling keyboard and mobile touch controls
 * @description manages key states, event handlers, and mobile control integration for game input
 */
class Input {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    F = false;
    D = false;

    /**
     * @summary initializes input system with keyboard event handlers
     * @description sets up event listeners for keydown and keyup events
     */
    constructor() {
        this.setupKeyboardEvents();
    }

    /**
     * @summary sets up keyboard event listeners for input detection
     * @description binds keydown and keyup event handlers to document
     */
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
    }

    /**
     * @summary handles keyboard key press events
     * @description processes keydown events and sets corresponding input flags
     * @param {KeyboardEvent} e - keyboard event containing key information
     */
    handleKeyDown(e) {
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.LEFT = true;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.RIGHT = true;
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
            case ' ':
                this.SPACE = true;
                this.UP = true;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.DOWN = true;
                break;
            case 'f':
            case 'F':
                this.F = true;
                this.D = true;
                break;
        }
        
        if (e.key === 'h' || e.key === 'H') {
            window.showHitboxes = !window.showHitboxes;
        }
    }

    /**
     * @summary handles keyboard key release events
     * @description processes keyup events and resets corresponding input flags
     * @param {KeyboardEvent} e - keyboard event containing key information
     */
    handleKeyUp(e) {
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.LEFT = false;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.RIGHT = false;
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
            case ' ':
                this.SPACE = false;
                this.UP = false;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.DOWN = false;
                break;
            case 'f':
            case 'F':
                this.F = false;
                this.D = false;
                break;
        }
    }

    /**
     * @summary programmatically sets key state for mobile controls integration
     * @description allows external systems to simulate key presses and releases
     * @param {string} key - key identifier to modify
     * @param {boolean} pressed - whether key should be pressed or released
     */
    setKeyPressed(key, pressed) {
        switch(key) {
            case 'ArrowLeft':
                this.LEFT = pressed;
                break;
            case 'ArrowRight':
                this.RIGHT = pressed;
                break;
            case ' ':
                this.SPACE = pressed;
                this.UP = pressed;
                break;
            case 'f':
                this.F = pressed;
                this.D = pressed;
                break;
        }
    }
}