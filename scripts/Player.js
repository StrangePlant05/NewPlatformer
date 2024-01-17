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
        this.deathPosition = {};
        this.deathTimeout;
        this.currentCheckpoint = undefined;
        this.destroyCooldown = undefined;
        this.isDestroying = false;
    }
    update(context, camera) {
        this.dx = Utils.getDirection(this, this.acceleration, this.friction, this.keybinds);
        this.collision = Utils.checkForCollisions(this, 10, 5);
        this.checkDestroyBox(context, camera);
        super.update(context, camera);
    }

    jump() {
        if (this.collision.bottom) {
            this.velocityY = -this.jumpStrength;
        }
    }

    checkForBoxes() {
        let nearby = Utils.getNearby(this, 50);
        if (nearby) {
            if (nearby.wall instanceof Prop) {
                return nearby.wall;
            }
        }
        return null;
    }

    checkDestroyBox(context, camera) {
        let box = this.checkForBoxes();
        if (box) {
            if (!this.destroyCooldown && this.isDestroying) {
                this.isDestroying = false;
                box.killYourselfNOW(context, camera);
                this.destroyCooldown = setTimeout(()=> {
                    this.destroyCooldown = undefined;
                }, 2000)
            }
        }
    }

    destroyBox() {
        this.isDestroying = true;
        setTimeout(()=> {
            this.isDestroying = false;
        }, 200)
    }
}