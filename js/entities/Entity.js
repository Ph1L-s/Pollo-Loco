
class MovebleObject {
    x = 120;
    y = 150;
    img;
    height = 150;
    width = 100;

    // load img
    loadImage(path){
        this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
        this.img.src = path;
    }
    

    moveRight(){
        console.log('moving right');
    }

    moveLeft(){

    }
}