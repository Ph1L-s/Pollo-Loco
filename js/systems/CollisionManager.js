class CollisionManager {
    constructor() {
        this.collisionTypes = [];
    }

    checkCollisions(character, enemies, throwableObjects) {

        enemies.forEach((enemy) => {
            if (character.isColliding(enemy)) {
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
}