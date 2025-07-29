class ThrowableObject extends ObjectEntity {
    constructor(x, y, otherDirection) {
        super();
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.otherDirection = otherDirection; 
        this.loadImage('assets/images/sprites/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.throw();
    }

    throw() {
        this.speedY = 20;
        this.applyGravity();
        
        setInterval(() => {
            if (this.otherDirection) {
                this.x -= 1;
            } else {
                this.x += 1;
            }
        }, 25);
    }
}