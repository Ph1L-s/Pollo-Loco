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
        if (mo.draw && typeof mo.draw === 'function') {
            mo.draw(this.ctx);
            return;
        }

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

    render(backgroundObjects, clouds, character, enemies, throwableObjects, bottles, statusBar, collisionManager = null) {
        this.clear();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(backgroundObjects);
        this.addObjectsToMap(clouds);
        this.addToMap(character);
        this.addObjectsToMap(enemies);
        this.addObjectsToMap(throwableObjects);
        this.addObjectsToMap(bottles);
        
        // Draw hitboxes if collision manager is provided
        if (collisionManager) {
            console.log('Renderer calling drawHitboxes');
            collisionManager.drawHitboxes(this.ctx, character, enemies);
        }
        
        // EMERGENCY HITBOX TEST - always draw simple boxes for now
        if (window.showHitboxes) {
            console.log('EMERGENCY: Drawing test hitboxes');
            this.ctx.save();
            this.ctx.strokeStyle = 'lime';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(character.x, character.y, character.width, character.height);
            
            enemies.forEach(enemy => {
                if (!enemy.isDead) {
                    this.ctx.strokeStyle = 'red';
                    this.ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
                }
            });
            this.ctx.restore();
        }
        
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(statusBar); 
    }
}