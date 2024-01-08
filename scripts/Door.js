class Interactive extends Sprite{
    constructor({x,y,height, width, plate,color, pointA, pointB}){
        super({x, y, width, height, width,color})
        this.pointA = { ...pointA}
        this.pointB = { ...pointB}
    }

    update(context, camera) {
        // Utils.moveTowards(this.position.x, plate.isPressed ? pointB.x : pointA.x, 3)
        Utils.moveTowards(this.position.y, plate.isPressed ? pointB.y : pointA.y, 3)

        this.draw(context, camera)
    }
}