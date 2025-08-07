class CollisionManager {
    constructor() {
        this.collisionTypes = [];
        this.hitboxManager = new HitboxManager();
    }

    checkCollisions(character, enemies, throwableObjects) {
        // Use new hitbox system for player-enemy collisions
        this.hitboxManager.checkPlayerEnemyCollisions(character, enemies);

        // Keep old system for bottle collisions
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

    toggleCollisions(objects, show, types = []) {
        objects.forEach(obj => {
            if (types.length === 0 || types.some(type => obj instanceof type)) {
                if (obj.toggleCollision) {
                    obj.toggleCollision(show);
                }
            }
        });
    }

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

    // Show/hide hitboxes
    toggleHitboxes(show) {
        this.hitboxManager.toggleHitboxes(show);
    }

    // Draw hitboxes
    drawHitboxes(ctx, player, enemies) {
        this.hitboxManager.drawAllHitboxes(ctx, player, enemies);
    }
}