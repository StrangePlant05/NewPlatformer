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
        this.playerOpacity = 100;
        this.deathPosition = {};
    }
    update(context, camera) {
        this.dx = Utils.getDirection(this, this.acceleration, this.friction, this.keybinds);
        this.collision = Utils.checkForCollisions(this, 20, 10);
        if (!this.isDead) {
            context.fillStyle = this.color;
            super.update(context, camera);
        } else {
            console.log(this.playerOpacity)
            let applyOpacity;
            this.playerOpacity = Utils.moveTowards(this.playerOpacity, 0, 4);
            applyOpacity = this.playerOpacity.toString().length == 1 ? "0" + this.playerOpacity : this.playerOpacity;
            context.fillStyle = this.color + applyOpacity;
            context.fillRect(this.deathPosition.x - camera.x, this.deathPosition.y - camera.y, this.width, this.height)
        }
    }

    jump() {
        if (this.collision.bottom) {
            this.velocityY = -this.jumpStrength;
        }
    }

    killYourselfNOW() {
        this.isDead = true;
        this.deathPosition = {x: this.position.x, y: this.position.y}
        setTimeout(() => {
            this.playerOpacity = 100;
            this.position = {...this.respawn};
            this.velocityX = 0;
            this.velocityY = 0;
            this.dx = 0;
            this.isDead = false;
            super.update(context, camera);
        }, 700);
    }
}