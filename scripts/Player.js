class Player extends Entity{
    constructor({x, y, width, height, color, walls, keybinds, entities, respawn, jumpStrength, speed}) {
        super({
            x: x, 
            y: y, 
            width: width, 
            height: height, 
            color: color, 
            walls: walls, 
            speed: speed, 
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
        this.jumpStrength = jumpStrength;
        this.keybinds = keybinds;
        this.respawn = respawn;
        this.isDead = false;
    }
    update(context, camera) {
        this.dx = Utils.getDirection(this, this.acceleration, this.friction, this.keybinds);
        this.collision = Utils.checkForCollisions(this, 20, 10);
        if (!this.isDead) {
            super.update(context, camera);
        }
    }

    jump() {
        if (this.collision.bottom) {
            this.velocityY = -this.jumpStrength;
        }
    }

    killYourselfNOW() {
        this.isDead = true;
        setTimeout(() => {
            this.position = {...this.respawn};
            this.velocityX = 0;
            this.velocityY = 0;
            this.dx = 0;
            this.isDead = false;
            super.update(context, camera);
        }, 200)
    }
}