/**
 * @class Cloud
 * @extends ObjectEntity
 * @summary background cloud object for atmospheric decoration
 * @description provides moving cloud element in background layer with animation
 */
class Cloud extends ObjectEntity {
    x = 120;
    y = 10;
    width = 650;
    height = 320;
    img;

    /**
     * @summary initializes cloud with sprite and starts animation sequence
     * @description loads cloud image and begins movement animation
     */
    constructor(){
        super().loadImage('assets/images/backgrounds/layers/4_clouds/1.png');
        this.animate();
    }

    /**
     * @summary starts cloud movement animation
     * @description initiates leftward movement for parallax scrolling effect
     */
    animate(){
        this.moveLeft();
        
    }

    /**
     * @summary placeholder method for rightward cloud movement
     * @description currently empty - reserved for future cloud movement logic
     */
    moveRight(){

    }
    
    /**
     * @summary placeholder method for leftward cloud movement
     * @description currently empty - reserved for cloud scrolling implementation
     */
    moveLeft(){

    }

}