let canvas;
let world;
let input = new Input();

// Make sure world is immediately accessible
window.world = null;

console.log('Game.js loaded');

function init() {
    console.log('init() called');
    try {
        canvas = document.getElementById('gameCanvas');
        console.log('canvas:', canvas);

        // input ist bereits oben global initialisiert!
        world = new World(canvas, input, level_1);
        console.log('world created:', world);
        
        // Make world accessible globally
        window.world = world;
        console.log('window.world set:', window.world);

        console.log('my Character is', world.character);
    } catch (error) {
        console.error('Error in init():', error);
    }
}


// Also try calling init directly when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded fired');
    if (!window.world) {
        init();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.keyCode === 68 || event.keyCode === 39) input.RIGHT = true;
    if (event.keyCode === 65 || event.keyCode === 37) input.LEFT = true;
    if (event.keyCode === 83 || event.keyCode === 40) input.DOWN = true;
    if (event.keyCode === 87 || event.keyCode === 38) input.UP = true;
    if (event.keyCode === 32) input.SPACE = true;
});

document.addEventListener('keyup', (event) => {
    if (event.keyCode === 68 || event.keyCode === 39) input.RIGHT = false;
    if (event.keyCode === 65 || event.keyCode === 37) input.LEFT = false;
    if (event.keyCode === 83 || event.keyCode === 40) input.DOWN = false;
    if (event.keyCode === 87 || event.keyCode === 38) input.UP = false;
    if (event.keyCode === 32) input.SPACE = false;
});