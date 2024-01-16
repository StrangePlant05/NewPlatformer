class Prop extends Entity {
    constructor({x, y, width, height, color, walls, entities}) {
        super({
            x: x, 
            y: y, 
            width: width, 
            height: height, 
            color: color, 
            walls: walls, 
            speed: 10, 
            gravity: 0.8,
            entities: entities
        });
        this.collision = {
            top: false,
            left: false,
            bottom: false,
            right: false
        };
    }

    update(context, camera) {
        this.dx = Utils.moveTowards(this.dx, 0, 0.05)
        this.collision = Utils.checkForCollisions(this, 20, 10)
        super.update(context, camera);
    }
}