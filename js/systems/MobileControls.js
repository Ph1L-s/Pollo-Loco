/**
 * @class MobileControls
 * @summary mobile device control system managing touch input and fullscreen functionality
 * @description handles touch-based controls for mobile devices, fullscreen management, and device detection
 */
class MobileControls {
    /**
     * @summary initializes mobile controls system with input integration
     * @description sets up touch controls, fullscreen handlers, and device detection
     * @param {Object} inputSystem - input system instance to integrate with
     */
    constructor(inputSystem) {
        this.inputSystem = inputSystem;
        this.isEnabled = false;
        this.init();
    }

    /**
     * @summary initializes all mobile control systems
     * @description sets up touch controls, fullscreen functionality, and device detection
     */
    init() {
        this.setupMobileControls();
        this.setupFullscreenControls();
        this.detectMobileDevice();
    }

    /**
     * @summary detects if device supports mobile touch controls
     * @description checks for touch capability and mobile user agent
     */
    detectMobileDevice() {
        this.isEnabled = 'ontouchstart' in window && /Mobi|Android/i.test(navigator.userAgent);
    }

    /**
     * @summary sets up touch controls for mobile game interaction
     * @description binds touch events to control buttons for movement and actions
     */
    setupMobileControls() {
        const leftButton = document.getElementById('mobileLeft');
        const rightButton = document.getElementById('mobileRight');
        const jumpButton = document.getElementById('mobileJump');
        const throwButton = document.getElementById('mobileThrow');

        if (leftButton) {
            this.addTouchEvents(leftButton, 'ArrowLeft');
        }
        if (rightButton) {
            this.addTouchEvents(rightButton, 'ArrowRight');
        }
        if (jumpButton) {
            this.addTouchEvents(jumpButton, ' ');
        }
        if (throwButton) {
            this.addTouchEvents(throwButton, 'f');
        }
    }

    /**
     * @summary adds touch event handlers to control button
     * @description binds touch events for mobile touch controls
     * @param {HTMLElement} button - button element to add events to
     * @param {string} key - key identifier to map touch events to
     */
    addTouchEvents(button, key) {
        let isPressed = false;
        
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!isPressed) {
                isPressed = true;
                this.inputSystem.setKeyPressed(key, true);
                button.style.transform = 'scale(0.95)';
            }
        }, { passive: false });

        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (isPressed) {
                isPressed = false;
                this.inputSystem.setKeyPressed(key, false);
                button.style.transform = 'scale(1)';
            }
        }, { passive: false });

        button.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            if (isPressed) {
                isPressed = false;
                this.inputSystem.setKeyPressed(key, false);
                button.style.transform = 'scale(1)';
            }
        }, { passive: false });
        
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }

    /**
     * @summary sets up fullscreen toggle controls
     * @description binds click handler to fullscreen button for viewport management
     */
    setupFullscreenControls() {
        const fullscreenButton = document.getElementById('fullscreenButton');
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
    }

    /**
     * @summary toggles fullscreen mode for game viewport
     * @description manages fullscreen API and CSS classes for optimal viewing experience
     */
    toggleFullscreen() {
        const gameContainer = document.getElementById('gameContainer');
        const canvas = document.getElementById('gameCanvas');
        const title = document.querySelector('h1');
        const body = document.body;

        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                body.classList.add('fullscreen');
                gameContainer.classList.add('fullscreen');
                canvas.classList.add('fullscreen');
                title.classList.add('fullscreen-hidden');
            }).catch(err => {
                console.log('Error attempting to enable fullscreen:', err.message);
                this.simulateFullscreen();
            });
        } else {
            document.exitFullscreen().then(() => {
                body.classList.remove('fullscreen');
                gameContainer.classList.remove('fullscreen');
                canvas.classList.remove('fullscreen');
                title.classList.remove('fullscreen-hidden');
            });
        }
    }

    /**
     * @summary provides fallback fullscreen simulation when API unavailable
     * @description manually applies fullscreen CSS classes with escape key handler
     */
    simulateFullscreen() {
        const gameContainer = document.getElementById('gameContainer');
        const canvas = document.getElementById('gameCanvas');
        const title = document.querySelector('h1');
        const body = document.body;

        body.classList.add('fullscreen');
        gameContainer.classList.add('fullscreen');
        canvas.classList.add('fullscreen');
        title.classList.add('fullscreen-hidden');

        const exitFullscreenHandler = (e) => {
            if (e.key === 'Escape') {
                body.classList.remove('fullscreen');
                gameContainer.classList.remove('fullscreen');
                canvas.classList.remove('fullscreen');
                title.classList.remove('fullscreen-hidden');
                document.removeEventListener('keydown', exitFullscreenHandler);
            }
        };

        document.addEventListener('keydown', exitFullscreenHandler);
    }

    /**
     * @summary enables mobile-specific interface adaptations
     * @description applies CSS classes for mobile device optimizations
     */
    enableMobileMode() {
        document.body.classList.add('mobile-mode');
    }

    /**
     * @summary disables mobile interface adaptations
     * @description removes mobile-specific CSS classes
     */
    disableMobileMode() {
        document.body.classList.remove('mobile-mode');
    }
}