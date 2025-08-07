/**
 * @class CollisionManager
 * @summary main collision detection system coordinating between entities and hitbox manager
 * @description manages collision detection between player, enemies, and projectiles using advanced hitbox system
 */
class CollisionManager {
    /**
     * @summary initializes collision manager with hitbox manager instance
     * @description creates collision type tracking and advanced hitbox detection system
     */
    constructor() {
        this.collisionTypes = [];
        this.hitboxManager = new HitboxManager();
    }

    /**
     * @summary processes all collision interactions between entities in the game world
     * @description delegates player-enemy collisions to hitbox manager, handles bottle-enemy collisions
     * @param {Player} character - player character to check collisions for
     * @param {Array<Enemy>} enemies - array of enemy entities
     * @param {Array<ThrowableObject>} throwableObjects - array of throwable bottle projectiles
     */
    checkCollisions(character, enemies, throwableObjects) {
        this.hitboxManager.checkPlayerEnemyCollisions(character, enemies);

        throwableObjects.forEach((bottle, bottleIndex) => {
            enemies.forEach((enemy, enemyIndex) => {
                if (bottle.isColliding && bottle.isColliding(enemy)) {
                    enemies.splice(enemyIndex, 1);
                    throwableObjects.splice(bottleIndex, 1);
                    console.log('Enemy hit by bottle');
                }
            });
        });
    }

    /**
     * @summary toggles collision boundary visualization for debugging purposes
     * @description shows or hides collision boxes for specified object types or all objects
     * @param {Array<Object>} objects - array of game objects to toggle collision display
     * @param {boolean} show - whether to show or hide collision boundaries
     * @param {Array<Function>} types - optional array of class types to filter display
     */
    toggleCollisions(objects, show, types = []) {
        objects.forEach(obj => {
            if (types.length === 0 || types.some(type => obj instanceof type)) {
                if (obj.toggleCollision) {
                    obj.toggleCollision(show);
                }
            }
        });
    }

    /**
     * @summary resolves physical collision by separating overlapping entities
     * @description calculates minimum overlap and pushes entities apart on shortest axis
     * @param {Player} player - player entity to separate from collision
     * @param {Enemy} enemy - enemy entity involved in collision
     */
    handlePhysicalCollision(player, enemy) {
        let overlapX = Math.min(player.x + player.width - enemy.x, enemy.x + enemy.width - player.x);
        let overlapY = Math.min(player.y + player.height - enemy.y, enemy.y + enemy.height - player.y);
        
        if (overlapX < overlapY) {
            if (player.x < enemy.x) {
                player.x = enemy.x - player.width;
            } else {
                player.x = enemy.x + enemy.width;
            }
        } else {
            if (player.y < enemy.y) {
                player.y = enemy.y - player.height;
            } else {
                player.y = enemy.y + enemy.height;
            }
        }
    }

    /**
     * @summary toggles hitbox visualization for advanced collision debugging
     * @description delegates hitbox display control to hitbox manager system
     * @param {boolean} show - whether to show or hide detailed hitboxes
     */
    toggleHitboxes(show) {
        this.hitboxManager.toggleHitboxes(show);
    }

    /**
     * @summary renders debug hitboxes for all game entities
     * @description delegates hitbox rendering to hitbox manager with color coding
     * @param {CanvasRenderingContext2D} ctx - canvas rendering context
     * @param {Player} player - player entity to draw hitbox for
     * @param {Array<Enemy>} enemies - array of enemy entities to draw hitboxes for
     */
    drawHitboxes(ctx, player, enemies) {
        this.hitboxManager.drawAllHitboxes(ctx, player, enemies);
    }
}