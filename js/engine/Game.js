let canvas;
let world;
let input = new Input();
let gameStarted = false;
let gameOver = false;
let showHitboxes = false;

const GAME_OVER_IMAGE = [
    'assets/images/ui/9_intro_outro_screens/game_over/game_over.png'
];


/**
 * @summary initializes and starts the main game session
 * @description hides start screen, creates world instance with level 1, and activates game loop
 */
function startGame() {
    if (gameStarted) return;
    
    
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameCanvas').style.filter = 'none';
    
    gameOver = false;
    window.gameOver = false;

    canvas = document.getElementById('gameCanvas');
    world = new World(canvas, input, createLevel1());
    window.world = world;
    
    gameStarted = true;
}

/**
 * @summary resets game state and starts new game session
 * @description cleans up current world, stops animations, clears canvas and reinitializes game
 */
function restartGame() {
    
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('youWonScreen').style.display = 'none';
    
    gameStarted = false;
    gameOver = false;
    window.gameOver = false;
    
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
    
    startGame();
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
 * @summary displays game over screen with centered image and restart option
 * @description stops animations, clears world, loads game over image with aspect ratio scaling
 */
function showGameOver() {
    
    gameOver = true;
    window.gameOver = true;
    
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
    
    canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.001)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const gameOverImg = new Image();
    gameOverImg.onload = function() {
        
        const canvasRatio = canvas.width / canvas.height;
        const imageRatio = gameOverImg.width / gameOverImg.height;
        
        let drawWidth, drawHeight;
        if (imageRatio > canvasRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imageRatio;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imageRatio;
        }
        
        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;
        
        ctx.drawImage(gameOverImg, x, y, drawWidth, drawHeight);
        
        document.getElementById('gameOverScreen').style.display = 'flex';
    };
    gameOverImg.onerror = function() {
        document.getElementById('gameOverScreen').style.display = 'flex';
    };
    gameOverImg.src = GAME_OVER_IMAGE[0];
}

window.showGameOver = showGameOver;
window.gameOver = gameOver;


/**
 * @summary initializes dom event listeners and displays start screen
 * @description sets up button click handlers and shows initial game screen on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    
    showStartScreen();
    
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startGame);
    
    const restartButton = document.getElementById('restartButton');
    restartButton.addEventListener('click', restartGame);
    
    const youWonRestartButton = document.getElementById('youWonRestartButton');
    youWonRestartButton.addEventListener('click', restartGame);
});

/**
 * @summary handles keyboard input for game controls and debug features
 * @description maps wasd/arrow keys for movement, space for jump, f for action, h for hitbox toggle
 * @param {KeyboardEvent} event - keyboard event containing keyCode
 */
document.addEventListener('keydown', (event) => {
    if (event.keyCode === 68 || event.keyCode === 39) input.RIGHT = true;
    if (event.keyCode === 65 || event.keyCode === 37) input.LEFT = true;
    if (event.keyCode === 83 || event.keyCode === 40) input.DOWN = true;
    if (event.keyCode === 87 || event.keyCode === 38) input.UP = true;
    if (event.keyCode === 70) input.F = true;
    if (event.keyCode === 32) input.SPACE = true;
    if (event.keyCode === 72 && world) {
        showHitboxes = !showHitboxes;
        window.showHitboxes = showHitboxes;
        world.toggleCollisions(showHitboxes);
    }
});

/**
 * @summary handles keyboard input release for smooth movement controls
 * @description resets input flags when keys are released to stop movement
 * @param {KeyboardEvent} event - keyboard event containing keyCode
 */
document.addEventListener('keyup', (event) => {
    if (event.keyCode === 68 || event.keyCode === 39) input.RIGHT = false;
    if (event.keyCode === 65 || event.keyCode === 37) input.LEFT = false;
    if (event.keyCode === 83 || event.keyCode === 40) input.DOWN = false;
    if (event.keyCode === 87 || event.keyCode === 38) input.UP = false;
    if (event.keyCode === 70) input.F = false;
    if (event.keyCode === 32) input.SPACE = false;
});