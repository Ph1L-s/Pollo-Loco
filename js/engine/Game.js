let canvas;
let world;
let input = new Input();
let gameStarted = false;
let gameOver = false;
let showHitboxes = false;
let menuManager;
let mobileControls;
let gameStateManager;

/**
 * @summary initializes and starts the main game session with complete state management
 * @description hides start screen, preloads images if needed, creates world instance, activates game loop with tracking
 */
function startGame() {
    if (gameStarted) return;
    
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameCanvas').style.filter = 'none';
    
    gameOver = false;
    window.gameOver = false;
    window.gameStarted = true;

    if (gameStateManager) {
        gameStateManager.startGame();
        
        if (!window.imagesPreloaded) {
            gameStateManager.preloadAllGameImages().then(() => {
                window.imagesPreloaded = true;
                initializeGameWorld();
            });
        } else {
            initializeGameWorld();
        }
    } else {
        initializeGameWorld();
    }
}

/**
 * @summary initializes world and game objects after image preloading
 * @description creates world instance and starts background music
 */
function initializeGameWorld() {
    canvas = document.getElementById('gameCanvas');
    world = new World(canvas, input, createLevel1());
    window.world = world;
    
    if (menuManager) {
        menuManager.getSoundManager().startBackgroundMusic();
    }
    
    gameStarted = true;
}

/**
 * @summary resets game state and starts new game session with complete cleanup
 * @description cleans up all resources, resets state manager, and reinitializes game
 */
function restartGame() {
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('youWonScreen').style.display = 'none';
    
    gameStarted = false;
    gameOver = false;
    window.gameOver = false;
    window.gameStarted = false;
    
    if (gameStateManager) {
        gameStateManager.restartGame();
    }
    
    canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    document.getElementById('gameCanvas').style.filter = 'none';
    
    if (world) {
        if (world.character) {
            world.character.stopAnimation();
        }
        if (world.enemies) {
            world.enemies.forEach(enemy => enemy.stopAnimation());
        }
        world = null;
        window.world = null;
    }
    
    setTimeout(() => {
        initializeGameWorld();
    }, 200);
}

/**
 * @summary displays initial game start screen
 * @description renders blue background on canvas before game begins
 */
function showStartScreen() {
    canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#0c159ccc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * @summary displays game over screen with complete system shutdown
 * @description stops all audio, intervals, animations, and rendering completely
 */
function showGameOver() {
    gameOver = true;
    window.gameOver = true;
    window.gameStarted = false;
    
    if (gameStateManager) {
        gameStateManager.handleGameOver();
    }
    
    if (menuManager) {
        menuManager.showGameOver();
    }
    
    if (world) {
        if (world.character) {
            world.character.stopAnimation();
        }
        if (world.enemies) {
            world.enemies.forEach(enemy => enemy.stopAnimation());
        }
        world = null;
        window.world = null;
    }
    
    document.getElementById('gameOverScreen').style.display = 'flex';
}

/**
 * @summary displays victory screen with complete system shutdown
 * @description shows you won screen, stops all audio/intervals, and shuts down game systems
 */
function showYouWonScreen() {
    gameOver = true;
    window.gameOver = true;
    window.gameStarted = false;
    
    if (gameStateManager) {
        gameStateManager.handleVictory();
    }
    
    if (menuManager) {
        menuManager.showVictory();
    }
    
    document.getElementById('youWonScreen').style.display = 'flex';
    document.getElementById('gameCanvas').style.filter = 'blur(5px)';
}

window.showGameOver = showGameOver;
window.showYouWonScreen = showYouWonScreen;
window.gameOver = gameOver;


/**
 * @summary initializes dom event listeners and displays start screen
 * @description sets up button click handlers and shows initial game screen on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    showStartScreen();
    
    gameStateManager = new GameStateManager();
    window.gameStateManager = gameStateManager;
    
    menuManager = new MenuManager();
    window.menuManager = menuManager;
    
    const restartButton = document.getElementById('restartButton');
    restartButton.addEventListener('click', restartGame);
    
    const youWonRestartButton = document.getElementById('youWonRestartButton');
    youWonRestartButton.addEventListener('click', restartGame);
    
    const soundToggleButton = document.getElementById('soundToggleButton');
    if (soundToggleButton) {
        soundToggleButton.addEventListener('click', function() {
            if (menuManager) {
                const isMuted = menuManager.getSoundManager().toggleMute();
                soundToggleButton.textContent = isMuted ? '🔇' : '🔊';
            }
        });
        
        if (menuManager) {
            const isInitiallyMuted = menuManager.getSoundManager().isMutedState();
            soundToggleButton.textContent = isInitiallyMuted ? '🔇' : '🔊';
        }
    }
});

/**
 * @summary initializes mobile controls and input systems
 * @description sets up touch controls for mobile devices and fullscreen functionality
 */
function initMobileControls() {
    mobileControls = new MobileControls(input);
}

/**
 * @summary initializes mobile controls when DOM is ready
 * @description ensures mobile control system is available after page load
 */
document.addEventListener('DOMContentLoaded', function() {
    initMobileControls();
});