class Player extends Entity{
    constructor({x, y, width, height, color, entities}) {
        super({
            x: x, 
            y: y, 
            width: width, 
            height: height, 
            color: color, 
            entities: entities, 
            speed: 10, 
            gravity: 0.8
        });
        this.collision = {
            top: false,
            left: false,
            bottom: false,
            right: false
        };
        this.acceleration = 0.2;
        this.jumpStrength = 15;
    }
    update(context) {
        this.dx = Utils.getDirection(this, this.acceleration);
        this.checkForCollisions(20, 10);
        super.update(context);
    }

    jump() {
        if (this.collision.bottom) {
            this.velocityY = -this.jumpStrength;
        }
    }

    checkForCollisions(offsetHorizontal, offsetVertical) {
        this.collision = {
            left: !!Utils.raycast(this, {x: this.position.x - offsetHorizontal, y: this.position.y}, { x: 0, y: 1 }, this.height, this.entities) || 
                Utils.raycast(this, {x: this.position.x - offsetHorizontal, y: this.position.y + this.height}, { x: 0, y: -1 }, this.height, this.entities),

            right: !!Utils.raycast(this, {x: this.position.x + this.width + offsetHorizontal, y: this.position.y}, { x: 0, y: 1 }, this.height, this.entities) || 
                Utils.raycast(this, {x: this.position.x + this.width + offsetHorizontal, y: this.position.y + this.height}, { x: 0, y: -1 }, this.height, this.entities),

            bottom: !!Utils.raycast(this, {x: this.position.x - 2 + this.width, y: this.position.y + this.height + offsetVertical}, { x: -1, y: 0 }, this.width - 2, this.entities) || 
                Utils.raycast(this, {x: this.position.x + 2, y: this.position.y + this.height + offsetVertical}, { x: 1, y: 0 }, this.width - 2, this.entities),

            top: !!Utils.raycast(this, {x: this.position.x + this.width + offsetHorizontal, y: this.position.y}, { x: 0, y: 1 }, this.height, this.entities) || 
                Utils.raycast(this, {x: this.position.x + this.width + offsetHorizontal, y: this.position.y + this.height}, { x: 0, y: -1 }, this.height, this.entities),
        }
    }
}