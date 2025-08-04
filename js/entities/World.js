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

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            if (!this.enemies || this.character.isDead()) return;
            this.checkCollisions();
            this.checkThrowObjects();
        }, 144);
    }

    checkThrowObjects(){
        if(this.input.F){
            let bottle = new ThrowableObject(
                this.character.x, 
                this.character.y, 
                this.character.otherDirection 
            );
            this.throwableObjects.push(bottle);
            this.input.F = false; 
        }
    }

    checkCollisions(){
        this.collisionManager.checkCollisions(this.character, this.enemies, this.throwableObjects);
        this.statusBar.setPercentage(this.character.energy);
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