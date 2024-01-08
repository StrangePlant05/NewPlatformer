class Interactive extends Sprite{
    constructor({ x, y, width, height, plate, color, pointAX, pointAY, pointBX, pointBY }){
        super({x, y, width, height, color})
        this.plate = plate;
        this.pointAX = pointAX;
        this.pointAY = pointAY;
        this.pointBX = pointBX
        this.pointBY = pointBY;
        this.speed = 9999;
    }

    update(context, camera) {
        this.draw(context, camera)
        this.position.x = Utils.moveTowards(this.position.x, this.plate.isPressed ? this.pointBX : this.pointAX, 1);
        this.position.y = Utils.moveTowards(this.position.y, this.plate.isPressed ? this.pointBY : this.pointAY, 3);
        // if(this.plate.isPressed){
        //     Utils.moveTowards(this.position.y,this.pointA.y, 3)
        // }else{
        //     Utils.moveTowards(this.position.y,this.pointB.y, 3)
        //     setTimeout(function(){
        //         Utils.moveTowards(this.position.y,this.pointB.y, 9999)
        //     },3000)
        // }
        // if (this.plate.isPressed){
        //     this.position.x = this.pointBX
        //     this.position.y = this.pointBY
        // }else{
        //     this.position.x = this.pointAX
        //     this.position.y = this.pointAY
        // }

        // this.position.y += this.speed


    }
}