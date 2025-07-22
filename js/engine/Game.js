let canvas;
let world;

// Make sure world is immediately accessible
window.world = null;

console.log('Game.js loaded');

function init() {
    console.log('init() called');
    try {
        canvas = document.getElementById('gameCanvas');
        console.log('canvas:', canvas);
        world = new World(canvas);
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
