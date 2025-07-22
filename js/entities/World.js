class World {

    character = new Player();
    enemies = [
        new Enemy(),
        new Enemy(),
        new Enemy(),
    ];

    clouds = [
        new Cloud()
    ];

    backgroundObjects = [
        new BackgroundObject('assets/images/backgrounds/layers/air.png', 0),
        new BackgroundObject('assets/images/backgrounds/layers/3_third_layer/1.png', 0),
        new BackgroundObject('assets/images/backgrounds/layers/2_second_layer/1.png', 0),
        new BackgroundObject('assets/images/backgrounds/layers/1_first_layer/1.png', 0),
        
    ];

    canvas;
    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        

        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    }
}
