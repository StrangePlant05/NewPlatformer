class Interactive extends Sprite{
    constructor({ x, y, width, height, connectedId, color, pointA, pointB }){
        super({x, y, width, height, color})
        this.connectedId = connectedId;
        this.pointA = { ...pointA};
        this.pointB = { ...pointB};
        this.speed = 2;
        this.velocityX = 0;
        this.goingToB = false;
    }

    update(context, camera) {
        this.draw(context, camera)
        let plates = [];
        this.connectedId.forEach(id => {
            plates = plates.concat(Utils.currentStage.buttons.filter(button => { return button.id == id && button.isTouching }));
        });
        let isPressed = plates.length > 0;

        this.goingToB = isPressed;
        this.position.x = Utils.moveTowards(this.position.x, isPressed ? this.pointB.x : this.pointA.x, this.speed);
        this.position.y = Utils.moveTowards(this.position.y, isPressed ? this.pointB.y : this.pointA.y, this.speed);
    }
}