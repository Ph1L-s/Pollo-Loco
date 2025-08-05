class CollisionManager {
    constructor() {
        this.collisionTypes = [];
    }

    checkCollisions(character, enemies, throwableObjects) {

        enemies.forEach((enemy) => {
            if (!enemy.isDead && character.isColliding(enemy)) {
                character.hit();
                console.log('Player hit by enemy');
            }
        });

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
}