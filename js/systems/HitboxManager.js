/**
 * @class HitboxManager
 * @summary advanced collision detection system with knockback physics and debugging visualization
 * @description handles precise collision detection between player and enemies with directional response
 */
class HitboxManager {
    /**
     * @summary initializes hitbox manager with debug visualization disabled
     * @description sets up collision detection system with hitbox display toggle
     */
    constructor() {
        this.showHitboxes = false;
    }

    /**
     * @summary axis-aligned bounding box collision detection between two objects
     * @description checks if rectangular hitboxes overlap using aabb algorithm
     * @param {Object} obj1 - first object with x, y, width, height properties
     * @param {Object} obj2 - second object with x, y, width, height properties
     * @returns {boolean} true if objects are colliding
     */
    isColliding(obj1, obj2) {
        return obj1.x + obj1.width > obj2.x &&
               obj1.y + obj1.height > obj2.y &&
               obj1.x < obj2.x + obj2.width &&
               obj1.y < obj2.y + obj2.height;
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

        if (player.speedY < 0 && playerBottom < enemyTop + 20) {
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
        let knockbackForce = 10;
        
        player.isKnockedBack = true;
        
        if (player.x < enemy.x) {
            player.speedX = -knockbackForce;
        } else {
            player.speedX = knockbackForce;
        }
    }

    /**
     * @summary processes all collision interactions between player and enemy array
     * @description checks collisions, prevents spam damage with cooldown, handles directional responses
     * @param {Player} player - player object to check collisions against
     * @param {Array<Enemy>} enemies - array of enemy objects to test collisions with
     */
    checkPlayerEnemyCollisions(player, enemies) {
        enemies.forEach((enemy) => {
            if (!enemy.isDead && this.isColliding(player, enemy)) {
                let timeSinceLastHit = Date.now() - (enemy.lastPlayerHit || 0);
                if (timeSinceLastHit < 300) {
                    return;
                }
                
                let collisionType = this.getCollisionType(player, enemy);
                
                if (collisionType === 'top') {
                    this.handleTopCollision(player, enemy);
                    enemy.lastPlayerHit = Date.now();
                } else {
                    let shouldTakeDamage = this.handleSideCollision(player, enemy);
                    if (shouldTakeDamage) {
                        player.hit();
                        enemy.lastPlayerHit = Date.now();
                    }
                }
            }
        });
    }

    /**
     * @summary toggles hitbox visualization for debugging collision detection
     * @description enables or disables visual representation of object collision boundaries
     * @param {boolean} show - whether to display hitboxes
     */
    toggleHitboxes(show) {
        this.showHitboxes = show;
    }

    /**
     * @summary renders individual object hitbox with colored outline and transparent fill
     * @description draws debugging rectangle showing collision boundary with customizable color
     * @param {CanvasRenderingContext2D} ctx - canvas rendering context
     * @param {Object} obj - object with x, y, width, height properties
     * @param {string} color - css color string for hitbox visualization
     */
    drawHitbox(ctx, obj, color = 'red') {
        if (!this.showHitboxes) return;
        
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 1.0;
        ctx.rect(obj.x, obj.y, obj.width, obj.height);
        ctx.stroke();
        
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.2;
        ctx.fill();
        
        ctx.restore();
    }

    /**
     * @summary renders hitboxes for all game entities with color coding
     * @description draws player hitbox in blue and living enemy hitboxes in red for debugging
     * @param {CanvasRenderingContext2D} ctx - canvas rendering context
     * @param {Player} player - player object to draw hitbox for
     * @param {Array<Enemy>} enemies - array of enemy objects to draw hitboxes for
     */
    drawAllHitboxes(ctx, player, enemies) {
        if (!this.showHitboxes) return;
        
        this.drawHitbox(ctx, player, 'blue');
        
        enemies.forEach(enemy => {
            if (!enemy.isDead) {
                this.drawHitbox(ctx, enemy, 'red');
            }
        });
    }
}