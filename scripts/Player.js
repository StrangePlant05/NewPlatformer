class Player extends Entity{
    constructor({x, y, width, height, color, walls, keybinds, entities}) {
        super({
            x: x, 
            y: y, 
            width: width, 
            height: height, 
            color: color, 
            walls: walls, 
            speed: 15, 
            gravity: 0.8,
            entities: entities
        });
        this.collision = {
            top: false,
            left: false,
            bottom: false,
            right: false
        };
        this.acceleration = 0.03;
        this.friction = 0.1
        this.jumpStrength = 15;
        this.keybinds = keybinds;
    }
    update(context, camera) {
        this.dx = Utils.getDirection(this, this.acceleration, this.friction, this.keybinds);
        this.collision = Utils.checkForCollisions(this, 20, 10);
        super.update(context, camera);
    }

    jump() {
        if (this.collision.bottom) {
            this.velocityY = -this.jumpStrength;
        }
    }
}