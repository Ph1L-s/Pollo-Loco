/**
 * @class MenuManager
 * @summary comprehensive menu system with sound controls, fullscreen, and game instructions
 * @description handles start screen interactions, settings persistence, and fullscreen functionality
 */
class MenuManager {
    /**
     * @summary initializes menu system with sound manager and event handlers
     * @description sets up all menu interactions, fullscreen controls, and loads saved settings
     */
    constructor() {
        this.soundManager = new SoundManager();
        this.isFullscreen = false;
        this.setupEventListeners();
        this.updateMenuDisplay();
    }

    /**
     * @summary sets up all menu button and slider event handlers
     * @description binds click events for menu navigation and volume controls
     */
    setupEventListeners() {
        const startButton = document.getElementById('startButton');
        const muteButton = document.getElementById('muteButton');
        const volumeSlider = document.getElementById('volumeSlider');
        const instructionsButton = document.getElementById('instructionsButton');
        const backToMenuButton = document.getElementById('backToMenuButton');
        const fullscreenButton = document.getElementById('fullscreenButton');
        
        // New menu buttons
        const guideButton = document.getElementById('guideButton');
        const optionsButton = document.getElementById('optionsButton');
        const backToMenuFromGuide = document.getElementById('backToMenuFromGuide');
        const backToMenuFromOptions = document.getElementById('backToMenuFromOptions');
        
        // Game Over screen buttons
        const gameOverGuideButton = document.getElementById('gameOverGuideButton');
        const gameOverOptionsButton = document.getElementById('gameOverOptionsButton');
        const gameOverMenuButton = document.getElementById('gameOverMenuButton');
        
        // You Won screen buttons
        const youWonGuideButton = document.getElementById('youWonGuideButton');
        const youWonOptionsButton = document.getElementById('youWonOptionsButton');
        const youWonMenuButton = document.getElementById('youWonMenuButton');

        if (startButton) {
            startButton.addEventListener('click', () => this.startGame());
        }

        if (muteButton) {
            muteButton.addEventListener('click', () => this.toggleMute());
        }

        if (volumeSlider) {
            volumeSlider.value = this.soundManager.getMasterVolume();
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        }

        if (instructionsButton) {
            instructionsButton.addEventListener('click', () => this.showInstructions());
        }

        if (backToMenuButton) {
            backToMenuButton.addEventListener('click', () => this.showMenu());
        }

        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', () => this.toggleFullscreen());
        }
        
        // New menu navigation
        if (guideButton) {
            guideButton.addEventListener('click', () => this.showGuide());
        }
        
        if (optionsButton) {
            optionsButton.addEventListener('click', () => this.showOptions());
        }
        
        if (backToMenuFromGuide) {
            backToMenuFromGuide.addEventListener('click', () => this.showMenu());
        }
        
        if (backToMenuFromOptions) {
            backToMenuFromOptions.addEventListener('click', () => this.showMenu());
        }
        
        // Game Over screen navigation
        if (gameOverGuideButton) {
            gameOverGuideButton.addEventListener('click', () => this.showGuideFromGameOver());
        }
        
        if (gameOverOptionsButton) {
            gameOverOptionsButton.addEventListener('click', () => this.showOptionsFromGameOver());
        }
        
        if (gameOverMenuButton) {
            gameOverMenuButton.addEventListener('click', () => this.backToMainMenu());
        }
        
        // You Won screen navigation
        if (youWonGuideButton) {
            youWonGuideButton.addEventListener('click', () => this.showGuideFromYouWon());
        }
        
        if (youWonOptionsButton) {
            youWonOptionsButton.addEventListener('click', () => this.showOptionsFromYouWon());
        }
        
        if (youWonMenuButton) {
            youWonMenuButton.addEventListener('click', () => this.backToMainMenu());
        }

        document.addEventListener('fullscreenchange', () => this.onFullscreenChange());
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    /**
     * @summary starts the game and hides menu interface
     * @description triggers game initialization and background music start
     */
    startGame() {
        const startScreen = document.getElementById('startScreen');
        const gameCanvas = document.getElementById('gameCanvas');
        
        if (startScreen) {
            startScreen.style.display = 'none';
        }
        
        if (gameCanvas) {
            gameCanvas.style.filter = 'none';
        }

        this.soundManager.startBackgroundMusic();
        
        if (window.startGame) {
            window.startGame();
        }
    }

    /**
     * @summary toggles audio mute state and updates UI
     * @description switches between muted and unmuted state, updates button appearance
     */
    toggleMute() {
        const isMuted = this.soundManager.toggleMute();
        this.updateMuteButton(isMuted);
    }

    /**
     * @summary sets master volume level
     * @description updates volume slider and sound manager volume settings
     * @param {number} volume - volume level between 0.0 and 1.0
     */
    setVolume(volume) {
        this.soundManager.setMasterVolume(parseFloat(volume));
    }

    /**
     * @summary displays game instructions screen
     * @description hides main menu and shows detailed gameplay instructions
     */
    showInstructions() {
        const menuContainer = document.querySelector('.menu-container');
        const instructionsDiv = document.getElementById('gameInstructions');
        
        if (menuContainer) {
            menuContainer.style.display = 'none';
        }
        
        if (instructionsDiv) {
            instructionsDiv.style.display = 'block';
        }
    }

    /**
     * @summary returns to main menu from instructions
     * @description hides instructions and shows main menu interface
     */
    showMenu() {
        const menuContainer = document.querySelector('.menu-container');
        const instructionsDiv = document.getElementById('gameInstructions');
        const guidePanel = document.getElementById('guidePanel');
        const optionsPanel = document.getElementById('optionsPanel');
        
        // Hide all panels
        if (instructionsDiv) instructionsDiv.style.display = 'none';
        if (guidePanel) guidePanel.style.display = 'none';
        if (optionsPanel) optionsPanel.style.display = 'none';
        
        // Show main menu
        if (menuContainer) {
            menuContainer.style.display = 'flex';
        }
    }

    /**
     * @summary toggles fullscreen mode for game canvas
     * @description enters or exits fullscreen mode with proper scaling
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                this.isFullscreen = true;
                document.body.classList.add('fullscreen-active');
                this.updateFullscreenButton();
            }).catch(err => {
                console.warn('Failed to enter fullscreen:', err);
            });
        } else {
            document.exitFullscreen().then(() => {
                this.isFullscreen = false;
                document.body.classList.remove('fullscreen-active');
                this.updateFullscreenButton();
            }).catch(err => {
                console.warn('Failed to exit fullscreen:', err);
            });
        }
    }

    /**
     * @summary handles fullscreen change events
     * @description updates UI state when fullscreen is toggled via browser controls
     */
    onFullscreenChange() {
        this.isFullscreen = !!document.fullscreenElement;
        
        if (this.isFullscreen) {
            document.body.classList.add('fullscreen-active');
        } else {
            document.body.classList.remove('fullscreen-active');
        }
        
        this.updateFullscreenButton();
    }

    /**
     * @summary handles keyboard shortcuts for menu functions
     * @description processes ESC key for fullscreen exit and other shortcuts
     * @param {KeyboardEvent} event - keyboard event object
     */
    handleKeydown(event) {
        if (event.key === 'Escape' && this.isFullscreen) {
            this.toggleFullscreen();
        }
        
        if (event.key === 'M' || event.key === 'm') {
            this.toggleMute();
        }
    }

    /**
     * @summary updates mute button appearance based on audio state
     * @description changes button text and styling to reflect current mute status
     * @param {boolean} isMuted - current mute state
     */
    updateMuteButton(isMuted) {
        const muteButton = document.getElementById('muteButton');
        if (muteButton) {
            if (isMuted) {
                muteButton.textContent = '🔇 SOUND OFF';
                muteButton.classList.add('muted');
            } else {
                muteButton.textContent = '🔊 SOUND ON';
                muteButton.classList.remove('muted');
            }
        }
    }

    /**
     * @summary updates fullscreen button appearance
     * @description changes button icon based on current fullscreen state
     */
    updateFullscreenButton() {
        const fullscreenButton = document.getElementById('fullscreenButton');
        if (fullscreenButton) {
            fullscreenButton.textContent = this.isFullscreen ? '⛶' : '⛶';
            fullscreenButton.title = this.isFullscreen ? 'Exit Fullscreen (ESC)' : 'Enter Fullscreen';
        }
    }

    /**
     * @summary updates all menu display elements with current settings
     * @description refreshes UI to reflect current audio and display settings
     */
    updateMenuDisplay() {
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.value = this.soundManager.getMasterVolume();
        }
        
        this.updateMuteButton(this.soundManager.isMutedState());
        this.updateFullscreenButton();
    }

    /**
     * @summary gets reference to sound manager instance
     * @description provides access to sound manager for game integration
     * @returns {SoundManager} sound manager instance
     */
    getSoundManager() {
        return this.soundManager;
    }

    /**
     * @summary shows game over menu with sound
     * @description displays game over screen and plays appropriate sound effect
     */
    showGameOver() {
        this.soundManager.stopBackgroundMusic();
        this.soundManager.playSFX('GAME_OVER');
    }

    /**
     * @summary shows victory menu with sound
     * @description displays win screen and plays victory sound effect
     */
    showVictory() {
        this.soundManager.stopBackgroundMusic();
        this.soundManager.playSFX('GAME_WON');
    }

    /**
     * @summary shows game guide from main menu
     */
    showGuide() {
        document.getElementById('guidePanel').style.display = 'block';
        document.querySelector('.menu-container').style.display = 'none';
    }

    /**
     * @summary shows options panel from main menu
     */
    showOptions() {
        document.getElementById('optionsPanel').style.display = 'block';
        document.querySelector('.menu-container').style.display = 'none';
    }

    /**
     * @summary shows guide panel from game over screen
     */
    showGuideFromGameOver() {
        document.getElementById('gameOverScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'block';
        document.getElementById('guidePanel').style.display = 'block';
        document.querySelector('.menu-container').style.display = 'none';
    }

    /**
     * @summary shows options panel from game over screen
     */
    showOptionsFromGameOver() {
        document.getElementById('gameOverScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'block';
        document.getElementById('optionsPanel').style.display = 'block';
        document.querySelector('.menu-container').style.display = 'none';
    }

    /**
     * @summary shows guide panel from you won screen
     */
    showGuideFromYouWon() {
        document.getElementById('youWonScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'block';
        document.getElementById('guidePanel').style.display = 'block';
        document.querySelector('.menu-container').style.display = 'none';
    }

    /**
     * @summary shows options panel from you won screen
     */
    showOptionsFromYouWon() {
        document.getElementById('youWonScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'block';
        document.getElementById('optionsPanel').style.display = 'block';
        document.querySelector('.menu-container').style.display = 'none';
    }

    /**
     * @summary returns to main menu from any screen
     */
    backToMainMenu() {
        document.getElementById('gameOverScreen').style.display = 'none';
        document.getElementById('youWonScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'block';
        document.querySelector('.menu-container').style.display = 'block';
        document.getElementById('guidePanel').style.display = 'none';
        document.getElementById('optionsPanel').style.display = 'none';
        document.getElementById('gameInstructions').style.display = 'none';
    }

    /**
     * @summary resets menu to initial state
     * @description returns menu to start screen state for game restart
     */
    resetMenu() {
        const startScreen = document.getElementById('startScreen');
        const gameCanvas = document.getElementById('gameCanvas');
        
        if (startScreen) {
            startScreen.style.display = 'flex';
        }
        
        if (gameCanvas) {
            gameCanvas.style.filter = 'blur(3px)';
        }
        
        this.showMenu();
        this.soundManager.stopAllAudio();
    }
}

window.MenuManager = MenuManager;