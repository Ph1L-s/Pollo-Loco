let canvas;
let world;
let input = new Input();
let gameStarted = false;
let gameOver = false;

const GAME_OVER_IMAGE = [
    'assets/images/ui/9_intro_outro_screens/game_over/game_over.png'
];

console.log('Game.js loaded');

function startGame() {
    if (gameStarted) return;
    
    console.log('Starting game...');
    

    document.getElementById('startScreen').style.display = 'none';
    

    document.getElementById('gameCanvas').style.filter = 'none';
    
    gameOver = false;
    window.gameOver = false;

    canvas = document.getElementById('gameCanvas');
    world = new World(canvas, input, createLevel1());
    window.world = world;
    
    gameStarted = true;
    console.log('Game started!');
}

function showStartScreen() {
    canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#0c159ccc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function showGameOver() {
    console.log('Game Over!');
    console.log('GAME_OVER_IMAGE available?', typeof GAME_OVER_IMAGE);
    
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
    console.log('Canvas:', canvas);
    
    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.001)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log('Black background drawn');
    
    const gameOverImg = new Image();
    gameOverImg.onload = function() {
        console.log('Game Over image loaded:', gameOverImg.width, 'x', gameOverImg.height);
        
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
        console.log('Game Over image drawn at:', x, y, 'size:', drawWidth, 'x', drawHeight);
    };
    gameOverImg.onerror = function() {
        console.log('Failed to load Game Over image');
    };
    console.log('Loading image:', GAME_OVER_IMAGE[0]);
    gameOverImg.src = GAME_OVER_IMAGE[0];
}

window.showGameOver = showGameOver;
window.gameOver = gameOver;


document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - showing start screen');
    console.log('Current world state:', window.world);
    
    showStartScreen();
    
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startGame);
});

document.addEventListener('keydown', (event) => {
    if (event.keyCode === 68 || event.keyCode === 39) input.RIGHT = true;
    if (event.keyCode === 65 || event.keyCode === 37) input.LEFT = true;
    if (event.keyCode === 83 || event.keyCode === 40) input.DOWN = true;
    if (event.keyCode === 87 || event.keyCode === 38) input.UP = true;
    if (event.keyCode === 70) input.F = true;
    if (event.keyCode === 32) input.SPACE = true;
});

document.addEventListener('keyup', (event) => {
    if (event.keyCode === 68 || event.keyCode === 39) input.RIGHT = false;
    if (event.keyCode === 65 || event.keyCode === 37) input.LEFT = false;
    if (event.keyCode === 83 || event.keyCode === 40) input.DOWN = false;
    if (event.keyCode === 87 || event.keyCode === 38) input.UP = false;
    if (event.keyCode === 70) input.F = false;
    if (event.keyCode === 32) input.SPACE = false;
});