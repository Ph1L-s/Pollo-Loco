class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera_x = 0;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setCameraX(x) {
        this.camera_x = x;
    }

    addToMap(mo) {
        if (!mo.img || !mo.img.complete || mo.img.naturalWidth === 0) {
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

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    render(backgroundObjects, clouds, character, enemies, throwableObjects, statusBar) {
        this.clear();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(backgroundObjects);
        this.addObjectsToMap(clouds);
        this.addToMap(character);
        this.addObjectsToMap(enemies);
        this.addObjectsToMap(throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(statusBar); 
    }
}