class HitboxManager {
    constructor() {
        this.showHitboxes = false;
    }

    isColliding(obj1, obj2) {
        return obj1.x + obj1.width > obj2.x &&
               obj1.y + obj1.height > obj2.y &&
               obj1.x < obj2.x + obj2.width &&
               obj1.y < obj2.y + obj2.height;
    }

    getCollisionType(player, enemy) {
        let playerBottom = player.y + player.height;
        let enemyTop = enemy.y;

        if (player.speedY < 0 && playerBottom < enemyTop + 20) {
            return 'top';
        } else {
            return 'side';
        }
    }

    handleTopCollision(player, enemy) {
        if (enemy.startFalling) {
            enemy.startFalling();
        }
        player.speedY = 5;
        return false;
    }

    handleSideCollision(player, enemy) {
        this.applyKnockback(player, enemy);
        return true;
    }

    applyKnockback(player, enemy) {
        let knockbackForce = 10;
        
        player.isKnockedBack = true;
        
        if (player.x < enemy.x) {
            player.speedX = -knockbackForce;
        } else {
            player.speedX = knockbackForce;
        }
    }

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

    // Show/hide hitboxes
    toggleHitboxes(show) {
        this.showHitboxes = show;
    }

    // Draw hitboxes for debugging
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

    // Draw all hitboxes
    drawAllHitboxes(ctx, player, enemies) {
        if (!this.showHitboxes) return;
        
        // Draw player hitbox in blue
        this.drawHitbox(ctx, player, 'blue');
        
        // Draw enemy hitboxes in red
        enemies.forEach(enemy => {
            if (!enemy.isDead) {
                this.drawHitbox(ctx, enemy, 'red');
            }
        });
    }
}