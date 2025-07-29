class World {
    character = new Player();
    enemies = [];
    clouds = [];
    backgroundObjects = [];
    level = null;
    canvas;
    ctx;
    input;
    camera_x = 0;   
    statusBar = new StatusBar();
    throwableObjects = [];

    constructor(canvas, input, level) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.input = input;
        this.level = level;
        this.enemies = level.enemies || [];
        this.clouds = level.clouds || [];
        this.throwableObjects = [];
        this.backgroundObjects = level.backgroundObjects || [];
        this.character = new Player();
        this.setWorld();
        this.toggleCollisions(true, [Player, Enemy, BossEntity]);
        this.throwableObjects.push(new ThrowableObject()); 
        this.draw();
        this.checkCollisions();
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
        this.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
                console.log('Collision with Enemy, energy:', this.character.energy);
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.ctx.translate(-this.camera_x, 0);
        requestAnimationFrame(() => this.draw());
        this.addToMap(this.statusBar);
        this.addObjectsToMap(this.throwableObjects); 
    }

    toggleCollisions(show, types = []) {
        const allObjects = [
            this.character,
            ...this.enemies,
            ...this.clouds,
            ...this.backgroundObjects
        ];
        allObjects.forEach(obj => {
            if (types.length === 0 || types.some(type => obj instanceof type)) {
                obj.toggleCollision(show);
            }
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (!mo.img || !mo.img.complete) {
            return; 
        }

        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.x + mo.width, 0);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(mo.img, 0, mo.y, mo.width, mo.height);
            this.ctx.restore();
        } else {
            this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        }
        
        if (mo.drawCollision) {
            mo.drawCollision(this.ctx);
        }
    }
}