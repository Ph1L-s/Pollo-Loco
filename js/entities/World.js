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
        
        new BackgroundObject('assets/images/backgrounds/layers/air.png', 720),
        new BackgroundObject('assets/images/backgrounds/layers/3_third_layer/2.png', 720),
        new BackgroundObject('assets/images/backgrounds/layers/2_second_layer/2.png', 720),
        new BackgroundObject('assets/images/backgrounds/layers/1_first_layer/2.png', 720),

        new BackgroundObject('assets/images/backgrounds/layers/air.png', 1440),
        new BackgroundObject('assets/images/backgrounds/layers/3_third_layer/1.png', 1440),
        new BackgroundObject('assets/images/backgrounds/layers/2_second_layer/1.png', 1440),
        new BackgroundObject('assets/images/backgrounds/layers/1_first_layer/1.png', 1440),

        new BackgroundObject('assets/images/backgrounds/layers/air.png', 2160),
        new BackgroundObject('assets/images/backgrounds/layers/3_third_layer/2.png', 2160),
        new BackgroundObject('assets/images/backgrounds/layers/2_second_layer/2.png', 2160),
        new BackgroundObject('assets/images/backgrounds/layers/1_first_layer/2.png', 2160),
        
    ];

    canvas;
    ctx;
    input; 
    camera_x = 0;
    constructor(canvas, input) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.input = input;
        this.draw();
        this.setWorld();
    }

    setWorld(){
        this.character.world = this;
    };

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
    }
}
