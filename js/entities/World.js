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

    constructor(canvas, input, level) {
        this.canvas = canvas;
        this.input = input;
        this.level = level;
        
        // initialize objects when world started
        this.character = new Player();
        this.statusBar = new StatusBar();
        this.enemies = level.enemies || [];
        this.clouds = level.clouds || [];
        this.throwableObjects = [];
        this.bottles = [];
        this.spawnBottles();
        this.backgroundObjects = level.backgroundObjects || [];
        this.character = new Player();
        
        // initialize systems
        this.renderer = new Renderer(canvas);
        this.collisionManager = new CollisionManager();
        
        this.setWorld();
        const collisionObjects = [this.character];
        for(let enemy of this.enemies) {
            collisionObjects.push(enemy);
        }
        this.collisionManager.toggleCollisions(collisionObjects, true, [Player, Enemy, BossEntity]);
        this.throwableObjects.push(new ThrowableObject()); 
        this.draw();
        this.run();
    }

    spawnBottles() {
        for (let bottleIndex = 0; bottleIndex < 5; bottleIndex++) {
            let x = 300 + (bottleIndex * 400);
            let y = 300;
            this.bottles.push(new Bottle(x, y));
        }
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            if (!this.enemies || this.character.isDead()) return;
            this.checkCollisions();
            this.checkPlayerJumpOnEnemy();
            this.checkThrowObjects();
            this.checkBottleCollection();
            this.checkBottleEnemyCollisions();
            this.cleanupThrowableObjects();
        }, 144);
    }

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

    checkCollisions(){
        this.collisionManager.checkCollisions(this.character, this.enemies, this.throwableObjects);
        this.statusBar.setPercentage(this.character.energy);
    }

    checkBottleCollection() {
        this.bottles.forEach((bottle, bottleIndex) => {
            if (!bottle.isCollected() && this.isColliding(this.character, bottle)) {
                bottle.collect();
                this.statusBar.addBottle();
                this.bottles.splice(bottleIndex, 1);
            }
        });
    }

    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

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

    checkPlayerJumpOnEnemy() {
        this.enemies.forEach((enemy, bottleIndex) => {
            if (!enemy.isDead && !(enemy instanceof BossEntity) && this.isJumpingOnEnemy(this.character, enemy)) {
                enemy.isDead = true;
                enemy.startFalling();
                this.character.speedY = -15;
                console.log('Player jumped on enemy');
            }
        });
    }

    isJumpingOnEnemy(player, enemy) {
        let horizontalOverlap = player.x < enemy.x + enemy.width && player.x + player.width > enemy.x;
        let playerFeet = player.y + player.height;
        let enemyTop = enemy.y;
        let enemyMiddle = enemy.y + (enemy.height / 2);
        let isPlayerFalling = player.speedY > 0;
        
        return horizontalOverlap && isPlayerFalling && playerFeet > enemyTop && playerFeet < enemyMiddle;
    }

    cleanupThrowableObjects() {
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.shouldRemove);
        this.enemies = this.enemies.filter(enemy => !enemy.shouldRemove);
    }

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
            this.statusBar
        );
        requestAnimationFrame(() => this.draw());
    }

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
        this.collisionManager.toggleCollisions(allObjects, show, types);
    }
}