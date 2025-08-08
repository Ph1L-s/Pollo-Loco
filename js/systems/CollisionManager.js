/**
 * @class CollisionManager
 * @summary optimized collision detection system for all game entities
 * @description manages collision detection between player, enemies, and projectiles with integrated physics
 */
class CollisionManager {
    /**
     * @summary initializes collision manager with debug visualization
     * @description creates collision tracking with debug display toggle
     */
    constructor() {
        this.showCollisions = false;
    }

    /**
     * @summary processes all collision interactions between entities in the game world
     * @description handles player-enemy collisions with physics response and bottle-enemy collisions
     * @param {Player} character - player character to check collisions for
     * @param {Array<Enemy>} enemies - array of enemy entities
     * @param {Array<ThrowableObject>} throwableObjects - array of throwable bottle projectiles
     */
    checkCollisions(character, enemies, throwableObjects) {
        this.checkPlayerEnemyCollisions(character, enemies);

        throwableObjects.forEach((bottle, bottleIndex) => {
            enemies.forEach((enemy, enemyIndex) => {
                if (bottle.isColliding && bottle.isColliding(enemy)) {
                    if (window.menuManager) {
                        window.menuManager.getSoundManager().playSFX('BOTTLE_BREAK');
                    }
                    
                    if (enemy.constructor.name === 'BossEntity') {
                        enemy.hit(20);
                        
                        if (this.onBossHit) {
                            this.onBossHit(enemy.energy);
                        }
                        
                        if (enemy.isDead()) {
                            enemy.startFalling();
                        }
                    } else {
                        if (enemy.startFalling) {
                            enemy.startFalling();
                        }
                    }
                    throwableObjects.splice(bottleIndex, 1);
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
     * @summary processes collision interactions between player and enemy array
     * @description checks collisions, prevents spam damage with cooldown, handles directional responses
     * @param {Player} player - player object to check collisions against
     * @param {Array<Enemy>} enemies - array of enemy objects to test collisions with
     */
    checkPlayerEnemyCollisions(player, enemies) {
        enemies.forEach((enemy) => {
            let enemyDead = typeof enemy.isDead === 'function' ? enemy.isDead() : enemy.isDead;
            if (!enemyDead && player.isColliding(enemy) && !player.isDead()) {
                let collisionType = this.getCollisionType(player, enemy);
                
                if (collisionType === 'top') {
                    this.handleTopCollision(player, enemy);
                } else {
                    let shouldTakeDamage = this.handleSideCollision(player, enemy);
                    if (shouldTakeDamage) {
                        if (enemy.constructor.name === 'BossEntity') {
                            player.hit(30);
                            this.applyKnockback(player, enemy);
                        } else {
                            player.hit(20);
                        }
                        return;
                    }
                }
            }
        });
    }

    /**
     * @summary determines collision direction between player and enemy
     * @description analyzes player velocity and position to classify as top or side collision
     * @param {Player} player - player object with position and velocity
     * @param {Enemy} enemy - enemy object with position
     * @returns {string} 'top' for jump attacks, 'side' for horizontal collisions
     */
    getCollisionType(player, enemy) {
        let playerBottom = player.y + player.height;
        let enemyTop = enemy.y;
        
        let enemyLeft = enemy.x - (enemy.width * 0.15);
        let enemyRight = enemy.x + enemy.width + (enemy.width * 0.15);
        let playerCenterX = player.x + (player.width / 2);
        
        let isOverEnemy = playerCenterX >= enemyLeft && playerCenterX <= enemyRight;

        if (player.speedY < 0 && playerBottom < enemyTop + 20 && isOverEnemy) {
            return 'top';
        } else {
            return 'side';
        }
    }

    /**
     * @summary handles jump attack collision where player lands on enemy
     * @description triggers enemy death fall and gives player slight bounce
     * @param {Player} player - player object to apply bounce effect
     * @param {Enemy} enemy - enemy object to trigger death animation
     * @returns {boolean} false indicating no damage to player
     */
    handleTopCollision(player, enemy) {
        if (enemy.startFalling) {
            enemy.startFalling();
        }
        player.speedY = 5;
        return false;
    }

    /**
     * @summary handles horizontal collision between player and enemy
     * @description applies knockback physics and indicates player should take damage
     * @param {Player} player - player object to receive knockback
     * @param {Enemy} enemy - enemy object causing collision
     * @returns {boolean} true indicating player should take damage
     */
    handleSideCollision(player, enemy) {
        this.applyKnockback(player, enemy);
        return true;
    }

    /**
     * @summary applies directional knockback force to player based on enemy position
     * @description calculates knockback direction and applies horizontal velocity
     * @param {Player} player - player object to receive knockback physics
     * @param {Enemy} enemy - enemy object determining knockback direction
     */
    applyKnockback(player, enemy) {
        let knockbackForce = 12;
        
        player.isKnockedBack = true;
        
        if (player.x < enemy.x) {
            if (player.x > 100) {
                player.speedX = -knockbackForce;
            } else {
                player.x = 100; 
                player.speedX = 0;
            }
        } else {
            if (player.x < 3900) {
                player.speedX = knockbackForce;
            } else {
                player.x = 3900; 
                player.speedX = 0;
            }
        }
    }

    /**
     * @summary toggles collision visualization for debugging purposes
     * @description shows or hides collision boxes for all entities
     * @param {boolean} show - whether to show or hide collision boundaries
     */
    toggleCollisionDisplay(show) {
        this.showCollisions = show;
    }
}