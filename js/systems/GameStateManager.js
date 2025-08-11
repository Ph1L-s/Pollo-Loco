/**
 * @class GameStateManager
 * @summary centralized game state management with interval and animation tracking
 * @description handles complete game shutdown, cleanup, and state management
 */
class GameStateManager {
    /**
     * @summary initializes game state manager with tracking arrays
     * @description sets up interval, timeout, and animation frame tracking
     */
    constructor() {
        this.intervals = new Set();
        this.timeouts = new Set();
        this.animationFrames = new Set();
        this.isGameActive = false;
        this.isGamePaused = false;
        
        this.setupGlobalTracking();
    }

    /**
     * @summary sets up tracking for global interval and timeout functions
     * @description intercepts setInterval, setTimeout, requestAnimationFrame calls
     */
    setupGlobalTracking() {
        const originalSetInterval = window.setInterval;
        const originalSetTimeout = window.setTimeout;
        const originalRequestAnimationFrame = window.requestAnimationFrame;
        const originalClearInterval = window.clearInterval;
        const originalClearTimeout = window.clearTimeout;
        const originalCancelAnimationFrame = window.cancelAnimationFrame;

        window.setInterval = (callback, delay) => {
            const intervalId = originalSetInterval(callback, delay);
            this.intervals.add(intervalId);
            return intervalId;
        };

        window.setTimeout = (callback, delay) => {
            const timeoutId = originalSetTimeout(callback, delay);
            this.timeouts.add(timeoutId);
            return timeoutId;
        };

        window.requestAnimationFrame = (callback) => {
            const frameId = originalRequestAnimationFrame(callback);
            this.animationFrames.add(frameId);
            return frameId;
        };

        window.clearInterval = (intervalId) => {
            this.intervals.delete(intervalId);
            return originalClearInterval(intervalId);
        };

        window.clearTimeout = (timeoutId) => {
            this.timeouts.delete(timeoutId);
            return originalClearTimeout(timeoutId);
        };

        window.cancelAnimationFrame = (frameId) => {
            this.animationFrames.delete(frameId);
            return originalCancelAnimationFrame(frameId);
        };
    }

    /**
     * @summary starts game and sets active state
     * @description marks game as active and not paused
     */
    startGame() {
        this.isGameActive = true;
        this.isGamePaused = false;
    }

    /**
     * @summary pauses game without stopping intervals
     * @description sets pause flag but keeps intervals running
     */
    pauseGame() {
        this.isGamePaused = true;
    }

    /**
     * @summary resumes game from paused state
     * @description clears pause flag
     */
    resumeGame() {
        this.isGamePaused = false;
    }

    /**
     * @summary completely stops game and cleans up all resources
     * @description stops all intervals, timeouts, animations, and audio
     */
    stopGame() {
        this.isGameActive = false;
        this.isGamePaused = false;

        this.clearAllIntervals();
        this.clearAllTimeouts();
        this.clearAllAnimationFrames();
        this.stopAllAudio();
        this.stopWorldGameLoop();
    }

    /**
     * @summary clears all tracked intervals
     * @description stops all running intervals and clears tracking
     */
    clearAllIntervals() {
        this.intervals.forEach(intervalId => {
            try {
                clearInterval(intervalId);
            } catch (e) {
            }
        });
        this.intervals.clear();
    }

    /**
     * @summary clears all tracked timeouts
     * @description stops all running timeouts and clears tracking
     */
    clearAllTimeouts() {
        this.timeouts.forEach(timeoutId => {
            try {
                clearTimeout(timeoutId);
            } catch (e) {
            }
        });
        this.timeouts.clear();
    }

    /**
     * @summary clears all tracked animation frames
     * @description cancels all running animation frames and clears tracking
     */
    clearAllAnimationFrames() {
        this.animationFrames.forEach(frameId => {
            try {
                cancelAnimationFrame(frameId);
            } catch (e) {
            }
        });
        this.animationFrames.clear();
    }

    /**
     * @summary stops all audio through sound manager
     * @description shuts down audio system completely
     */
    stopAllAudio() {
        if (window.menuManager && window.menuManager.getSoundManager()) {
            window.menuManager.getSoundManager().shutdownAudio();
        }
    }

    /**
     * @summary reactivates audio system
     * @description re-enables audio after shutdown
     */
    reactivateAudio() {
        if (window.menuManager && window.menuManager.getSoundManager()) {
            window.menuManager.getSoundManager().reactivateAudio();
        }
    }

    /**
     * @summary stops world game loop if running
     * @description stops main world rendering and update loop
     */
    stopWorldGameLoop() {
        if (window.world) {
            if (typeof window.world.stopGameLoop === 'function') {
                window.world.stopGameLoop();
            }
            
            if (window.world.character) {
                window.world.character.stopAnimation();
            }
            
            if (window.world.enemies) {
                window.world.enemies.forEach(enemy => {
                    if (enemy.stopAnimation) {
                        enemy.stopAnimation();
                    }
                });
            }
            
            if (window.world.boss) {
                if (window.world.boss.stopAnimation) {
                    window.world.boss.stopAnimation();
                }
            }
        }
    }

    /**
     * @summary gets current game state information
     * @description returns detailed state and tracking info
     * @returns {Object} game state object
     */
    getGameState() {
        return {
            isActive: this.isGameActive,
            isPaused: this.isGamePaused,
            intervalCount: this.intervals.size,
            timeoutCount: this.timeouts.size,
            animationFrameCount: this.animationFrames.size
        };
    }

    /**
     * @summary handles game over scenario
     * @description complete shutdown for game over state
     */
    handleGameOver() {
        this.stopGame();
    }

    /**
     * @summary handles victory scenario  
     * @description complete shutdown for victory state
     */
    handleVictory() {
        this.stopGame();
    }

    /**
     * @summary restarts game state management
     * @description clears old state and prepares for new game
     */
    restartGame() {
        this.stopGame();
        
        setTimeout(() => {
            this.reactivateAudio();
            this.startGame();
        }, 100);
    }
}

window.GameStateManager = GameStateManager;