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

    constructor(canvas, input, level) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.input = input;
        this.level = level;
        this.enemies = level.enemies;
        this.clouds = level.clouds;
        this.backgroundObjects = level.backgroundObjects;
        this.character = new Player();
        this.setWorld();
        this.toggleCollisions(true, [Player, Enemy, BossEntity]);
        this.draw();
        this.checkCollisions();
    }

    setWorld() {
        this.character.world = this;
    }

    checkCollisions() {
        setInterval(() => {
            if (!this.enemies || this.character.isDead()) return;
            
            this.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy)) {
                    this.character.hit();
                    console.log('Collision with Enemy, energy:', this.character.energy);
                }
            });
        }, 200);
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
        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.x + mo.width, 0);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(mo.img, 0, mo.y, mo.width, mo.height);
            this.ctx.restore();
        } else {
            this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        }
        mo.drawCollision(this.ctx);
    }
}