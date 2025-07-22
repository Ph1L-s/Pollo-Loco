class Enemy extends MovebleObject{
 
    x = 120;
    y = 300;
    constructor(){
        super().loadImage('assets/images/sprites/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

        this.x = 200 + Math.random () * 500;
    }

}