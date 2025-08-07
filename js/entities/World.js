/**
 * @class World
 * @summary main game world coordinator managing all entities, systems and game logic
 * @description orchestrates player, enemies, collectibles, physics, rendering and collision detection
 */
class World {
    character;
    enemies = [];
    clouds = [];
    backgroundObjects = [];
    level = null;
    canvas;
    input;
    statusBar;
    throwableObjects = [];
    bottles = [];
    renderer;
    collisionManager;
    camera_x = 0;

    /**
     * @summary initializes world with level data, entities, and game systems
     * @description creates player, enemies, bottles, renderer, collision manager and starts game loop
     * @param {HTMLCanvasElement} canvas - game canvas element
     * @param {Input} input - input handler instance
     * @param {Level} level - level configuration with enemies, clouds, background objects
     */
    constructor(canvas, input, level) {
        this.canvas = canvas;
        this.input = input;
        this.level = level;
        
        this.character = new Player();
        this.statusBar = new StatusBar();
        this.enemies = level.enemies || [];
        this.clouds = level.clouds || [];
        this.throwableObjects = [];
        this.bottles = [];
        this.spawnBottles();
        this.backgroundObjects = level.backgroundObjects || [];
        this.character = new Player();
        
        this.renderer = new Renderer(canvas);
        this.collisionManager = new CollisionManager();
        
        this.setWorld();
        const collisionObjects = [this.character];
        for(let enemy of this.enemies) {
            collisionObjects.push(enemy);
        }
        for(let bottle of this.bottles) {
            collisionObjects.push(bottle);
        }
        this.collisionManager.toggleCollisions(collisionObjects, true, [Player, Enemy, BossEntity, Bottle]);
        this.throwableObjects.push(new ThrowableObject()); 
        this.draw();
        this.run();
    }

    /**
     * @summary creates collectible bottles at predefined positions across the level
     * @description spawns 5 bottles spaced 400 units apart horizontally for player collection
     */
    spawnBottles() {
        for (let bottleIndex = 0; bottleIndex < 5; bottleIndex++) {
            let x = 300 + (bottleIndex * 400);
            let y = 300;
            this.bottles.push(new Bottle(x, y));
        }
    }

    /**
     * @summary establishes world reference for character entity
     * @description allows player to access world state and systems for input processing
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * @summary main game logic update loop running at ~15fps
     * @description processes collisions, bottle throwing, collection, enemy interactions and cleanup
     */
    run() {
        setInterval(() => {
            if (!this.enemies || this.character.isDead()) return;
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkBottleCollection();
            this.checkBottleEnemyCollisions();
            this.cleanupThrowableObjects();
        }, 64);
    }

    /**
     * @summary handles bottle throwing input and creates throwable bottle projectiles
     * @description checks f key input, consumes bottle from inventory, spawns throwable object
     */
    checkThrowObjects(){
        if(this.input.F && this.statusBar.hasBottles()){
            if(this.statusBar.useBottle()){
                let bottle = new ThrowableObject(
                    this.character.x + 50, 
                    this.character.y + 80, 
                    this.character.otherDirection 
                );
                this.throwableObjects.push(bottle);
            }
            this.input.F = false; 
        }
    }

    /**
     * @summary processes collision detection between player, enemies, and projectiles
     * @description delegates to collision manager and updates health status bar
     */
    checkCollisions(){
        this.collisionManager.checkCollisions(this.character, this.enemies, this.throwableObjects);
        this.statusBar.setPercentage(this.character.energy);
    }

    /**
     * @summary detects and handles bottle pickup by player character
     * @description checks collision with bottles, marks as collected, updates status bar
     */
    checkBottleCollection() {
        this.bottles.forEach((bottle, bottleIndex) => {
            if (!bottle.isCollected() && this.isColliding(this.character, bottle)) {
                bottle.collect();
                this.statusBar.addBottle();
                this.bottles.splice(bottleIndex, 1);
            }
        });
    }

    /**
     * @summary basic axis-aligned bounding box collision detection
     * @description checks if two rectangular objects overlap using aabb algorithm
     * @param {Object} obj1 - first object with x, y, width, height properties
     * @param {Object} obj2 - second object with x, y, width, height properties
     * @returns {boolean} true if objects are colliding
     */
    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    /**
     * @summary handles collision between thrown bottles and enemy characters
     * @description stops bottle physics, triggers splash animation, kills enemy with fall
     */
    checkBottleEnemyCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            if (!bottle.isSplashing) {
                this.enemies.forEach((enemy, enemyIndex) => {
                    if (this.isColliding(bottle, enemy) && !enemy.isDead) {
                        bottle.isSplashing = true;
                        bottle.speedX = 0;
                        bottle.speedY = 0;
                        enemy.isDead = true;
                        enemy.startFalling();
                    }
                });
            }
        });
    }


    /**
     * @summary removes expired throwable objects and dead enemies from game arrays
     * @description filters out objects marked for removal to prevent memory leaks
     */
    cleanupThrowableObjects() {
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.shouldRemove);
        this.enemies = this.enemies.filter(enemy => !enemy.shouldRemove);
    }

    /**
     * @summary main rendering loop using requestAnimationFrame for smooth 60fps
     * @description sets camera position, delegates rendering to renderer system, schedules next frame
     */
    draw() {
        if (window.gameOver) {
            console.log('World draw stopped - game over');
            return;
        }
        
        this.renderer.setCameraX(this.camera_x);
        this.renderer.render(
            this.backgroundObjects,
            this.clouds,
            this.character,
            this.enemies,
            this.throwableObjects,
            this.bottles,
            this.statusBar,
            this.collisionManager
        );
        requestAnimationFrame(() => this.draw());
    }

    /**
     * @summary toggles collision box visualization for debugging purposes
     * @description collects all game objects and delegates visibility control to collision manager
     * @param {boolean} show - whether to show or hide collision boxes
     * @param {Array} types - optional array of object types to filter display
     */
    toggleCollisions(show, types = []) {
        const allObjects = [this.character];
        for(let enemy of this.enemies) {
            allObjects.push(enemy);
        }
        for(let cloud of this.clouds) {
            allObjects.push(cloud);
        }
        for(let bg of this.backgroundObjects) {
            allObjects.push(bg);
        }
        for(let bottle of this.bottles) {
            allObjects.push(bottle);
        }
        this.collisionManager.toggleCollisions(allObjects, show, types);
    }

    /**
     * @summary toggles hitbox visualization for advanced collision debugging
     * @description delegates hitbox display control to collision manager system
     * @param {boolean} show - whether to show or hide hitboxes
     */
    toggleHitboxes(show) {
        this.collisionManager.toggleHitboxes(show);
    }
}