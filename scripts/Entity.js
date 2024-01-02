class Entity extends Sprite{
    constructor({x, y, width, height, color, entities, speed, gravity}) {
        super({x, y, width, height, color});
        this.entities = entities;
        this.gravity = gravity;
        this.speed = speed;
        this.velocityX = 0;
        this.velocityY = 0;
        this.dx = 0;
    }

    update(context) {
        this.checkHorizontalCollision();
        this.applyGravity();
        this.checkVerticalCollision();
        this.draw(context);
        this.position.x += this.velocityX;
        this.velocityX = this.speed * this.dx;
    }

    applyGravity() {
        this.position.y += this.velocityY;
        this.velocityY += this.gravity;
    }

    checkHorizontalCollision() {
        const intersectionLeft = Utils.raycast(this, {x: this.position.x, y: this.position.y}, { x: 0, y: 1 }, this.height, this.entities) || 
            Utils.raycast(this, {x: this.position.x, y: this.position.y + this.height}, { x: 0, y: -1 }, this.height, this.entities);
            
        const intersectionRight = Utils.raycast(this, {x: this.position.x + this.width, y: this.position.y}, { x: 0, y: 1 }, this.height, this.entities) || 
            Utils.raycast(this, {x: this.position.x + this.width, y: this.position.y + this.height}, { x: 0, y: -1 }, this.height, this.entities);

        if (intersectionRight) {
            this.velocityX = 0;
            this.position.x = intersectionRight.wall.position.x - this.width - 0.01;
            this.dx = 0;
            return;
        }
        if (intersectionLeft) {
            this.velocityX = 0;
            this.position.x = intersectionLeft.wall.position.x + intersectionLeft.wall.width + 0.01;
            this.dx = 0;
            return;
        }
    }

    checkVerticalCollision() {
        const intersectionBottom = Utils.raycast(this, {x: this.position.x - 2 + this.width, y: this.position.y + this.height}, { x: -1, y: 0 }, this.width - 2, this.entities) || 
            Utils.raycast(this, {x: this.position.x + 2, y: this.position.y + this.height}, { x: 1, y: 0 }, this.width - 2, this.entities);

        const intersectionTop = Utils.raycast(this, {x: this.position.x + this.width, y: this.position.y}, { x: -1, y: 0 }, this.width, this.entities) || 
            Utils.raycast(this, {x: this.position.x, y: this.position.y}, { x: 1, y: 0 }, this.width, this.entities);

        if (intersectionBottom) {
            this.velocityY = 0;
            this.position.y = intersectionBottom.wall.position.y - this.height - 0.01;
            return;
        }
        if (intersectionTop) {
            this.velocityY = 0;
            this.position.y = intersectionTop.wall.position.y + intersectionTop.wall.height + 0.01;
            return;
        }
    }
}