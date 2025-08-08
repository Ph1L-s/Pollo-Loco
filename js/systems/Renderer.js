/**
 * @class Renderer
 * @summary main rendering system handling canvas operations and camera movement
 * @description manages 2d canvas rendering, sprite flipping, camera positioning, and debug visualization
 */
class Renderer {
    /**
     * @summary initializes renderer with canvas context and camera position
     * @description sets up 2d rendering context and camera tracking for side-scrolling
     * @param {HTMLCanvasElement} canvas - game canvas element for rendering
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera_x = 0;
    }

    /**
     * @summary clears entire canvas for next frame rendering
     * @description removes all drawn content from canvas using clearRect
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * @summary sets horizontal camera position for side-scrolling effect
     * @description updates camera x offset for world translation during rendering
     * @param {number} x - horizontal camera offset position
     */
    setCameraX(x) {
        this.camera_x = x;
    }

    /**
     * @summary renders single game object with sprite flipping and collision debugging
     * @description handles custom draw methods, sprite flipping for direction, collision boundary display
     * @param {Object} mo - game object with img, x, y, width, height properties
     */
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

    /**
     * @summary renders array of game objects using addToMap for each object
     * @description iterates through object array and renders each using individual render method
     * @param {Array<Object>} objects - array of game objects to render
     */
    addObjectsToMap(objects) {
        if (!objects || !Array.isArray(objects)) return;
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * @summary main render method drawing all game entities in correct layering order
     * @description clears canvas, applies camera transform, renders all objects, handles debug hitboxes
     * @param {Array<BackgroundObject>} backgroundObjects - background layer objects
     * @param {Array<Cloud>} clouds - cloud layer objects
     * @param {Player} character - main player character
     * @param {Array<Enemy>} enemies - enemy entities array
     * @param {Array<ThrowableObject>} throwableObjects - projectile objects
     * @param {Array<Bottle>} bottles - collectible bottle objects
     * @param {StatusBar} statusBar - ui status bar (rendered without camera transform)
     * @param {CollisionManager} collisionManager - optional collision manager for debug rendering
     */
    render(backgroundObjects, clouds, character, enemies, throwableObjects, bottles, coins, statusBar, collisionManager = null, bossStatusBar = null) {
        this.clear();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(backgroundObjects);
        this.addObjectsToMap(clouds);
        this.addToMap(character);
        this.addObjectsToMap(enemies);
        this.addObjectsToMap(throwableObjects);
        this.addObjectsToMap(bottles);
        this.addObjectsToMap(coins);
        
        // Render boss status bar with camera transform
        if (bossStatusBar) {
            this.addToMap(bossStatusBar);
        }
        
        if (collisionManager && collisionManager.showCollisions) {
            console.log('Renderer drawing collision boxes');
            character.drawCollision(this.ctx);
            enemies.forEach(enemy => enemy.drawCollision(this.ctx));
        }
        
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