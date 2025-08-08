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
        this.boss = this.enemies.find(enemy => enemy instanceof BossEntity);
        this.bossStatusBar = this.boss ? new BossStatusBar(this.boss.x, this.boss.y) : null;
        this.clouds = level.clouds || [];
        this.throwableObjects = [];
        this.bottles = [];
        this.coins = [];
        this.bottlePercentage = 0;
        this.coinPercentage = 0;
        this.lastThrowableObject = 0;
        this.spawnBottles();
        this.spawnCoins();
        this.backgroundObjects = level.backgroundObjects || [];
        this.character = new Player();
        
        this.renderer = new Renderer(canvas);
        this.collisionManager = new CollisionManager();
        
        // Set boss hit callback for status bar updates
        if (this.bossStatusBar) {
            this.collisionManager.onBossHit = (bossEnergy) => {
                this.bossStatusBar.setPercentage(bossEnergy);
            };
        }
        
        this.setWorld();
        const collisionObjects = [this.character];
        for(let enemy of this.enemies) {
            collisionObjects.push(enemy);
        }
        for(let bottle of this.bottles) {
            collisionObjects.push(bottle);
        }
        for(let coin of this.coins) {
            collisionObjects.push(coin);
        }
        this.collisionManager.toggleCollisions(collisionObjects, false, [Player, Enemy, SmallEnemy, BossEntity, Bottle, Coin]);
        this.throwableObjects.push(new ThrowableObject()); 
        this.draw();
        this.run();
    }

    /**
     * @summary creates collectible bottles at predefined positions across the level
     * @description spawns 5 bottles spaced 400 units apart horizontally for player collection
     */
    spawnBottles() {
        for (let bottleIndex = 0; bottleIndex < 8; bottleIndex++) {
            let x = 400 + Math.random() * 3200; // Zufällig über gesamte Spielfläche verteilt
            let y = 370; // Näher zum Boden
            this.bottles.push(new Bottle(x, y));
        }
    }

    spawnCoins() {
        for (let coinIndex = 0; coinIndex < 15; coinIndex++) {
            let x = 400 + Math.random() * 3200; // Zufällig über gesamte Spielfläche verteilt
            let y = 200 + Math.random() * 150; // Random zwischen 200-350 (verschiedene Höhen)
            this.coins.push(new Coin(x, y));
        }
    }

    /**
     * @summary establishes world reference for character entity
     * @description allows player to access world state and systems for input processing
     */
    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            if (!this.enemies || this.character.isDead()) return;
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkBottleCollection();
            this.checkCoinCollection();
            this.checkBottleEnemyCollisions();
            this.cleanupThrowableObjects();
        }, 64);
    }

    /**
     * @summary handles bottle throwing input and creates throwable bottle projectiles
     * @description checks f key input, consumes bottle from inventory, spawns throwable object
     */
    checkThrowObjects(){
        if(this.input.F && this.bottlePercentage > 0 && this.checkLastThrowenObjectTime()){
            let bottle = new ThrowableObject(
                this.character.x + 50, 
                this.character.y + 150, 
                this.character.otherDirection 
            );
            this.throwableObjects.push(bottle);
            
            this.lastThrowableObject = new Date().getTime();
            this.bottlePercentage -= 20;
            this.statusBar.setBottlePercentage(this.bottlePercentage);
            console.log(`Bottle thrown! Percentage: ${this.bottlePercentage}`);
            
            this.input.F = false; 
        }
    }

    checkLastThrowenObjectTime(){
        return new Date().getTime() - this.lastThrowableObject > 500;
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
            if (!bottle.isCollected() && this.isColliding(this.character, bottle) && this.bottlePercentage < 100) {
                bottle.collect();
                this.bottlePercentage += 20;
                this.statusBar.setBottlePercentage(this.bottlePercentage);
                console.log(`Bottle collected! Percentage: ${this.bottlePercentage}`);
                this.bottles.splice(bottleIndex, 1);
            }
        });
    }

    checkCoinCollection() {
        this.coins.forEach((coin, coinIndex) => {
            if (!coin.isCollected() && this.isColliding(this.character, coin)) {
                coin.collect();
                this.coinPercentage = Math.min(100, this.coinPercentage + (100 / 15)); // 15 coins = 100%
                this.statusBar.setCoinPercentage(this.coinPercentage);
                console.log(`Coin collected! Percentage: ${this.coinPercentage}`);
                this.coins.splice(coinIndex, 1);
            }
        });
    }

    /**
     * @summary offset-aware collision detection for precise hit detection
     * @description checks if two objects overlap using offset values for pixel-perfect collisions
     * @param {Object} obj1 - first object with x, y, width, height, offset properties
     * @param {Object} obj2 - second object with x, y, width, height, offset properties
     * @returns {boolean} true if objects are colliding
     */
    isColliding(obj1, obj2) {
        let offset1 = obj1.offset || { top: 0, left: 0, right: 0, bottom: 0 };
        let offset2 = obj2.offset || { top: 0, left: 0, right: 0, bottom: 0 };
        
        return obj1.x + obj1.width - offset1.right > obj2.x + offset2.left &&
               obj1.y + obj1.height - offset1.bottom > obj2.y + offset2.top &&
               obj1.x + offset1.left < obj2.x + obj2.width - offset2.right &&
               obj1.y + offset1.top < obj2.y + obj2.height - offset2.bottom;
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
                        
                        // Boss braucht mehrere Treffer
                        if (enemy.constructor.name === 'BossEntity') {
                            enemy.hit(20);
                            console.log(`Boss hit! Energy: ${enemy.energy}`);
                        } else {
                            enemy.hit(100); // Normale Enemies sterben sofort
                        }
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
        
        // Update boss status bar position (only if boss is alive)
        if (this.boss && this.bossStatusBar && !this.boss.isDead()) {
            this.bossStatusBar.updatePosition(this.boss.x, this.boss.y);
        } else if (this.boss && this.boss.isDead()) {
            // Hide boss status bar when boss is dead
            this.bossStatusBar = null;
            // Check if boss has fallen off screen to trigger win screen
            if (this.boss.shouldRemove) {
                this.showYouWonScreen();
            }
        }
        
        this.renderer.render(
            this.backgroundObjects,
            this.clouds,
            this.character,
            this.enemies,
            this.throwableObjects,
            this.bottles,
            this.coins,
            this.statusBar,
            this.collisionManager,
            this.bossStatusBar
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
     * @summary toggles collision visualization for debugging purposes
     * @description shows or hides collision boxes for debugging collision detection
     * @param {boolean} show - whether to show or hide collision boxes
     */
    toggleCollisions(show) {
        this.collisionManager.toggleCollisionDisplay(show);
        this.toggleCollision(show, [this.character, ...this.enemies]);
    }

    /**
     * @summary toggles collision display for array of entities
     * @description enables collision box visualization for specified entities
     * @param {boolean} show - whether to show collision boxes
     * @param {Array<ObjectEntity>} entities - entities to toggle collision display for
     */
    toggleCollision(show, entities) {
        entities.forEach(entity => {
            if (entity && entity.toggleCollision) {
                entity.toggleCollision(show);
            }
        });
    }

    /**
     * @summary displays you won screen when boss is defeated
     * @description shows victory screen with you_won image and restart button
     */
    showYouWonScreen() {
        console.log('You won! Boss defeated!');
        window.gameOver = true;
        document.getElementById('youWonScreen').style.display = 'flex';
        document.getElementById('gameCanvas').style.filter = 'blur(5px)';
    }
}