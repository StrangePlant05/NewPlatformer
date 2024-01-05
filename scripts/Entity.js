class Entity extends Sprite{
    constructor({x, y, width, height, color, walls, speed, gravity, entities}) {
        super({x, y, width, height, color});
        this.walls = walls;
        this.gravity = gravity;
        this.speed = speed;
        this.velocityX = 0;
        this.velocityY = 0;
        this.dx = 0;
        this.entities = entities;
    }

    update(context) {
        this.draw(context);
        this.position.x += this.velocityX;
        this.velocityX = this.speed * this.dx;
        this.checkHorizontalCollision();
        this.applyGravity();
        this.checkVerticalCollision();
    }

    applyGravity() {
        this.position.y += this.velocityY;
        this.velocityY += this.gravity;
    }

    checkHorizontalCollision() {
        const intersectionLeft = (
            Utils.raycast(this, { x: this.position.x, y: this.position.y }, { x: 0, y: 1 }, this.height, this.walls) || 
            Utils.raycast(this, { x: this.position.x, y: this.position.y + this.height }, { x: 0, y: -1 }, this.height, this.walls)|| 
            Utils.raycast(this, { x: this.position.x, y: this.position.y }, { x: 0, y: 1 }, this.height, this.entities) || 
            Utils.raycast(this, { x: this.position.x, y: this.position.y + this.height }, { x: 0, y: -1 }, this.height, this.entities));
             
        const intersectionRight = (
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y }, { x: 0, y: 1 }, this.height, this.walls) || 
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y + this.height }, { x: 0, y: -1 }, this.height, this.walls)||
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y }, { x: 0, y: 1 }, this.height, this.entities) || 
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y + this.height }, { x: 0, y: -1 }, this.height, this.entities));

        if (intersectionRight) {
            if (intersectionRight.wall.color == "yellow") {
                if (!intersectionRight.wall.collisions.right) {
                    intersectionRight.wall.velocityX = this.velocityX;
                    intersectionRight.wall.dx = this.dx
                    intersectionRight.wall.position.x = this.position.x + this.width
                    return
                }
            }
            this.velocityX = 0;
            this.position.x = intersectionRight.wall.position.x - this.width - 0.01
            this.dx = 0;
            return;
        }
        if (intersectionLeft) {
            if (intersectionLeft.wall.color == "yellow") {

                if (!intersectionLeft.wall.collisions.left) {
                    intersectionLeft.wall.velocityX = this.velocityX;
                    intersectionLeft.wall.dx = this.dx;
                    intersectionLeft.wall.position.x = this.position.x - this.width
                    return;
                }
            }
            this.velocityX = 0;
            this.position.x = intersectionLeft.wall.position.x + intersectionLeft.wall.width + 0.01
            this.dx = 0;
            return;
        }
    }

    checkVerticalCollision() {
        const intersectionBottom = 
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y + this.height + 2 }, { x: -1, y: 0 }, this.width, this.walls) || 
            Utils.raycast(this, { x: this.position.x, y: this.position.y + this.height + 2 }, { x: 1, y: 0 }, this.width, this.walls) ||
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y + this.height + 2 }, { x: -1, y: 0 }, this.width, this.entities) || 
            Utils.raycast(this, { x: this.position.x, y: this.position.y + this.height + 2 }, { x: 1, y: 0 }, this.width, this.entities);

        const intersectionTop = 
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y }, { x: -1, y: 0 }, this.width, this.walls) || 
            Utils.raycast(this, { x: this.position.x, y: this.position.y }, { x: 1, y: 0 }, this.width, this.walls) || 
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y }, { x: -1, y: 0 }, this.width, this.entities) || 
            Utils.raycast(this, { x: this.position.x, y: this.position.y }, { x: 1, y: 0 }, this.width, this.entities);

        if (intersectionBottom) {
            this.velocityY = 0;
            this.position.y = intersectionBottom.wall.position.y - this.height - 0.01;
            return;
        }
        if (intersectionTop) {
            if (this.velocityY <= 0.8 && this.velocityY >= -0.8) return
            this.velocityY = 0;
            this.position.y = intersectionTop.wall.position.y + intersectionTop.wall.height + 0.01        
            return;
        }
    }
}