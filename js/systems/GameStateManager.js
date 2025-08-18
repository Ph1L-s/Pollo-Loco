/**
 * @class GameStateManager
 * @summary centralized game state management with interval and animation tracking
 * @description handles complete game shutdown, cleanup, and state management
 */
class GameStateManager {
    /**
     * @summary initializes game state manager with tracking arrays and image cache
     * @description sets up interval, timeout, animation frame tracking, and global image cache
     */
    constructor() {
        this.intervals = new Set();
        this.timeouts = new Set();
        this.animationFrames = new Set();
        this.isGameActive = false;
        this.isGamePaused = false;
        this.globalImageCache = new Map();
        this.preloadingInProgress = false;
        
        this.setupGlobalTracking();
        this.setupGlobalImageCache();
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
     * @summary sets up global image cache system with localStorage
     * @description creates centralized image caching with localStorage backup
     */
    setupGlobalImageCache() {
        window.getGlobalImage = (path) => {
            return this.globalImageCache.get(path) || null;
        };

        window.preloadGlobalImages = (imagePaths, callback) => {
            this.preloadImages(imagePaths, callback);
        };

        window.clearGlobalImageCache = () => {
            this.globalImageCache.clear();
            try {
                localStorage.removeItem('polloLoco_imageCache_manifest');
            } catch (e) {}
        };
    }

    /**
     * @summary preloads array of images into global cache
     * @description loads images with localStorage caching and progress tracking
     * @param {Array<string>} imagePaths - array of image paths to preload
     * @param {Function} callback - callback function when preloading completes
     */
    preloadImages(imagePaths, callback) {
        if (this.preloadingInProgress) {
            return;
        }

        this.preloadingInProgress = true;
        let loadedCount = 0;
        const totalImages = imagePaths.length;

        const checkIfComplete = () => {
            if (loadedCount >= totalImages) {
                this.preloadingInProgress = false;
                this.saveImageCacheManifest(imagePaths);
                if (callback) callback();
            }
        };

        imagePaths.forEach(path => {
            if (this.globalImageCache.has(path)) {
                loadedCount++;
                checkIfComplete();
                return;
            }

            const img = new Image();
            img.onload = () => {
                this.globalImageCache.set(path, img);
                loadedCount++;
                checkIfComplete();
            };

            img.onerror = () => {
                console.warn(`Failed to preload image: ${path}`);
                loadedCount++;
                checkIfComplete();
            };

            img.src = path;
        });

        if (totalImages === 0) {
            this.preloadingInProgress = false;
            if (callback) callback();
        }
    }

    /**
     * @summary saves image cache manifest to localStorage
     * @description stores list of cached images for faster startup
     * @param {Array<string>} imagePaths - array of cached image paths
     */
    saveImageCacheManifest(imagePaths) {
        try {
            const manifest = {
                timestamp: Date.now(),
                paths: imagePaths,
                version: '1.0'
            };
            localStorage.setItem('polloLoco_imageCache_manifest', JSON.stringify(manifest));
        } catch (e) {}
    }

    /**
     * @summary loads image cache manifest from localStorage
     * @description retrieves cached image list for validation
     * @returns {Object|null} manifest object or null if not found
     */
    loadImageCacheManifest() {
        try {
            const manifestData = localStorage.getItem('polloLoco_imageCache_manifest');
            if (manifestData) {
                const manifest = JSON.parse(manifestData);
                const age = Date.now() - manifest.timestamp;
                if (age < 24 * 60 * 60 * 1000) {
                    return manifest;
                }
            }
        } catch (e) {}
        return null;
    }

    /**
     * @summary preloads all game images at startup
     * @description loads all game images into global cache for instant access
     * @returns {Promise} promise that resolves when all images are loaded
     */
    preloadAllGameImages() {
        return new Promise((resolve) => {
            const gameImages = [
                'assets/images/sprites/2_character_pepe/1_idle/idle/i_1.png',
                'assets/images/sprites/2_character_pepe/1_idle/idle/i_2.png',
                'assets/images/sprites/2_character_pepe/1_idle/idle/i_3.png',
                'assets/images/sprites/2_character_pepe/1_idle/idle/i_4.png',
                'assets/images/sprites/2_character_pepe/1_idle/idle/i_5.png',
                'assets/images/sprites/2_character_pepe/1_idle/idle/i_6.png',
                'assets/images/sprites/2_character_pepe/1_idle/idle/i_7.png',
                'assets/images/sprites/2_character_pepe/1_idle/idle/i_8.png',
                'assets/images/sprites/2_character_pepe/1_idle/idle/i_9.png',
                'assets/images/sprites/2_character_pepe/1_idle/idle/i_10.png',
                'assets/images/sprites/2_character_pepe/2_walk/w_21.png',
                'assets/images/sprites/2_character_pepe/2_walk/w_22.png',
                'assets/images/sprites/2_character_pepe/2_walk/w_23.png',
                'assets/images/sprites/2_character_pepe/2_walk/w_24.png',
                'assets/images/sprites/2_character_pepe/2_walk/w_25.png',
                'assets/images/sprites/2_character_pepe/2_walk/w_26.png',
                'assets/images/sprites/2_character_pepe/3_jump/j_31.png',
                'assets/images/sprites/2_character_pepe/3_jump/j_32.png',
                'assets/images/sprites/2_character_pepe/3_jump/j_33.png',
                'assets/images/sprites/2_character_pepe/3_jump/j_34.png',
                'assets/images/sprites/2_character_pepe/3_jump/j_35.png',
                'assets/images/sprites/2_character_pepe/3_jump/j_36.png',
                'assets/images/sprites/2_character_pepe/3_jump/j_37.png',
                'assets/images/sprites/2_character_pepe/3_jump/j_38.png',
                'assets/images/sprites/2_character_pepe/3_jump/j_39.png',
                'assets/images/sprites/2_character_pepe/4_hurt/h_41.png',
                'assets/images/sprites/2_character_pepe/4_hurt/h_42.png',
                'assets/images/sprites/2_character_pepe/4_hurt/h_43.png',
                'assets/images/sprites/2_character_pepe/5_dead/d_51.png',
                'assets/images/sprites/2_character_pepe/5_dead/d_52.png',
                'assets/images/sprites/2_character_pepe/5_dead/d_53.png',
                'assets/images/sprites/2_character_pepe/5_dead/d_54.png',
                'assets/images/sprites/2_character_pepe/5_dead/d_55.png',
                'assets/images/sprites/2_character_pepe/5_dead/d_56.png',
                'assets/images/sprites/2_character_pepe/5_dead/d_57.png',
                'assets/images/sprites/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
                'assets/images/sprites/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
                'assets/images/sprites/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
                'assets/images/sprites/3_enemies_chicken/chicken_normal/2_dead/dead.png',
                'assets/images/sprites/3_enemies_chicken/chicken_small/1_walk/1_w.png',
                'assets/images/sprites/3_enemies_chicken/chicken_small/1_walk/2_w.png',
                'assets/images/sprites/3_enemies_chicken/chicken_small/1_walk/3_w.png',
                'assets/images/sprites/3_enemies_chicken/chicken_small/2_dead/dead.png',
                'assets/images/sprites/4_enemie_boss_chicken/1_walk/g1.png',
                'assets/images/sprites/4_enemie_boss_chicken/1_walk/g2.png',
                'assets/images/sprites/4_enemie_boss_chicken/1_walk/g3.png',
                'assets/images/sprites/4_enemie_boss_chicken/1_walk/g4.png',
                'assets/images/sprites/4_enemie_boss_chicken/2_alert/g5.png',
                'assets/images/sprites/4_enemie_boss_chicken/2_alert/g6.png',
                'assets/images/sprites/4_enemie_boss_chicken/2_alert/g7.png',
                'assets/images/sprites/4_enemie_boss_chicken/2_alert/g8.png',
                'assets/images/sprites/4_enemie_boss_chicken/2_alert/g9.png',
                'assets/images/sprites/4_enemie_boss_chicken/2_alert/g10.png',
                'assets/images/sprites/4_enemie_boss_chicken/2_alert/g11.png',
                'assets/images/sprites/4_enemie_boss_chicken/2_alert/g12.png',
                'assets/images/sprites/4_enemie_boss_chicken/3_attack/g13.png',
                'assets/images/sprites/4_enemie_boss_chicken/3_attack/g14.png',
                'assets/images/sprites/4_enemie_boss_chicken/3_attack/g15.png',
                'assets/images/sprites/4_enemie_boss_chicken/3_attack/g16.png',
                'assets/images/sprites/4_enemie_boss_chicken/3_attack/g17.png',
                'assets/images/sprites/4_enemie_boss_chicken/3_attack/g18.png',
                'assets/images/sprites/4_enemie_boss_chicken/3_attack/g19.png',
                'assets/images/sprites/4_enemie_boss_chicken/3_attack/g20.png',
                'assets/images/sprites/4_enemie_boss_chicken/4_hurt/g21.png',
                'assets/images/sprites/4_enemie_boss_chicken/4_hurt/g22.png',
                'assets/images/sprites/4_enemie_boss_chicken/4_hurt/g23.png',
                'assets/images/sprites/4_enemie_boss_chicken/5_dead/g24.png',
                'assets/images/sprites/4_enemie_boss_chicken/5_dead/g25.png',
                'assets/images/sprites/4_enemie_boss_chicken/5_dead/g26.png',
                'assets/images/sprites/6_salsa_bottle/2_salsa_bottle_on_ground.png',
                'assets/images/sprites/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
                'assets/images/sprites/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
                'assets/images/sprites/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
                'assets/images/sprites/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
                'assets/images/sprites/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
                'assets/images/sprites/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
                'assets/images/sprites/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
                'assets/images/sprites/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
                'assets/images/sprites/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
                'assets/images/sprites/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
                'assets/images/ui/8_coin/coin_1.png',
                'assets/images/ui/8_coin/coin_2.png',
                'assets/images/backgrounds/layers/air.png',
                'assets/images/backgrounds/layers/4_clouds/1.png',
                'assets/images/backgrounds/layers/4_clouds/2.png'
            ];

            this.preloadImages(gameImages, resolve);
        });
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