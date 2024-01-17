    class Entity extends Sprite{
    constructor({x, y, width, height, color, walls, speed, gravity, entities}) {
        super({x, y, width, height, color});
        this.walls = walls;
        this.gravity = gravity;
        this.speed = speed;
        this.respawn = {
            x,
            y
        }
        this.originalX = x;
        this.originalY = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.dx = 0;
        this.entities = entities;
        this.isDead = false;
        this.deathPosition = {};
        this.deathTimeout;
        this.originalColor = color;
        this.playerOpacity = 100;
    }

    update(context, camera) {
        if (!this.isDead) {
            this.color = this.originalColor;
            this.draw(context, camera);
        } else {
            let applyOpacity;
            this.playerOpacity = Utils.moveTowards(this.playerOpacity, 0, 4);
            applyOpacity = this.playerOpacity.toString().length == 1 ? "0" + this.playerOpacity : this.playerOpacity;
            this.color = this.originalColor + applyOpacity;
            this.dx = Utils.moveTowards(this.dx, 0, 0.07);
            this.velocityY = Utils.moveTowards(this.velocityY, 0, 2);
            this.draw(context, camera);
        }
        this.draw(context, camera);
        this.position.x += this.velocityX;
        this.velocityX = this.speed * this.dx;
        this.checkHorizontalCollision();
        this.applyGravity();
        this.checkVerticalCollision();
        if (Utils.checkOverlap(this)) {
            this.killYourselfNOW(context, camera);
        }
    }

    applyGravity() {
        this.position.y += this.velocityY;
        this.velocityY += this.gravity;
    }

    checkHorizontalCollision() {
        const intersectionLeft = (
            Utils.raycast(this, { x: this.position.x, y: this.position.y + 5 }, { x: 0, y: 1 }, this.height - 12, this.walls) || 
            Utils.raycast(this, { x: this.position.x, y: this.position.y + this.height - 5 }, { x: 0, y: -1 }, this.height, this.walls)|| 
            Utils.raycast(this, { x: this.position.x, y: this.position.y + 5 }, { x: 0, y: 1 }, this.height - 12, this.entities) || 
            Utils.raycast(this, { x: this.position.x, y: this.position.y + this.height - 5 }, { x: 0, y: -1 }, this.height, this.entities));
             
        const intersectionRight = (
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y + 5 }, { x: 0, y: 1 }, this.height - 12, this.walls) || 
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y + this.height - 5}, { x: 0, y: -1 }, this.height, this.walls)||
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y + 5}, { x: 0, y: 1 }, this.height - 12, this.entities) || 
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y + this.height - 5}, { x: 0, y: -1 }, this.height, this.entities));

        if (intersectionRight) {
            if (intersectionRight.wall.isDead || this.isDead && (intersectionRight.wall instanceof Entity || intersectionRight.wall instanceof Interactive)) return;
            if (intersectionRight.wall instanceof Prop) {
                if (!intersectionRight.wall.collision.right) {
                    let multiplier = Math.min((((this.width * this.height)) / (intersectionRight.wall.width * intersectionRight.wall.height)+0.2), 1);
                    this.velocityX *= multiplier;
                    multiplier = 0.8;
                    this.dx *= multiplier;
                    intersectionRight.wall.velocityX = this.velocityX;
                    intersectionRight.wall.dx = this.dx
                    intersectionRight.wall.position.x = this.position.x + this.width;
                    console.log("a")
                    return
                } else {
                    this.velocityX = 0;
                    this.position.x = intersectionRight.wall.position.x - this.width - 0.01
                    this.dx = 0;
                    return;
                }
            }
            this.velocityX = 0;
            this.position.x = intersectionRight.wall.position.x - this.width - 0.01
            this.dx = 0;
            return;
        }
        if (intersectionLeft) {
            if (intersectionLeft.wall.isDead || this.isDead && (intersectionLeft.wall instanceof Entity || intersectionLeft.wall instanceof Interactive)) return;
            if (intersectionLeft.wall instanceof Prop) {
                if (!intersectionLeft.wall.collision.left) {
                    let multiplier = Math.min(((this.width * this.height) / (intersectionLeft.wall.width * intersectionLeft.wall.height)), 1);
                    this.velocityX *= multiplier;
                    multiplier = 0.8;
                    this.dx *= multiplier;
                    intersectionLeft.wall.velocityX = this.velocityX;
                    intersectionLeft.wall.dx = this.dx;
                    intersectionLeft.wall.position.x = this.position.x - intersectionLeft.wall.width
                    return;
                } else {
                    this.velocityX = 0;
                    this.position.x = intersectionLeft.wall.position.x + intersectionLeft.wall.width + 0.01
                    this.dx = 0;
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
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y + this.height + 3 }, { x: -1, y: 0 }, this.width, this.walls) || 
            Utils.raycast(this, { x: this.position.x, y: this.position.y + this.height + 3 }, { x: 1, y: 0 }, this.width, this.walls) ||
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y + this.height + 3 }, { x: -1, y: 0 }, this.width, this.entities) || 
            Utils.raycast(this, { x: this.position.x, y: this.position.y + this.height + 3}, { x: 1, y: 0 }, this.width, this.entities);

        const intersectionTop = 
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y }, { x: -1, y: 0 }, this.width, this.walls) || 
            Utils.raycast(this, { x: this.position.x, y: this.position.y }, { x: 1, y: 0 }, this.width, this.walls) || 
            Utils.raycast(this, { x: this.position.x + this.width, y: this.position.y }, { x: -1, y: 0 }, this.width, this.entities) || 
            Utils.raycast(this, { x: this.position.x, y: this.position.y }, { x: 1, y: 0 }, this.width, this.entities);
            
            
        let top = Utils.raycast(this, {x: this.position.x, y: this.position.y - 2}, {x: 1, y: 0}, this.width, this.entities);
        if (top) {
            if (top.wall instanceof Entity) {
                if (top.wall.collision.left || top.wall.collision.right) {
                    if ((top.wall.collision.left && Math.sign(this.velocityX) == -1) || (top.wall.collision.right && Math.sign(this.velocityX) == 1)) {
                        top.wall.position.x -= this.velocityX;
                    }
                }
            } 
        }
        if (intersectionBottom) {
            if (intersectionBottom.wall.isDead || this.isDead && (intersectionBottom.wall instanceof Entity || intersectionBottom.wall instanceof Interactive)) return;
            if (intersectionBottom.wall.velocityX) {
                this.position.x += intersectionBottom.wall.velocityX;
            }
            if (intersectionBottom.wall instanceof Interactive) {
                this.position.x += intersectionBottom.wall.speed * Math.sign(Math.ceil(intersectionBottom.wall.position.x) - Math.ceil((intersectionBottom.wall.goingToB ? intersectionBottom.wall.pointB.x : intersectionBottom.wall.pointA.x))) * -1
            }
            this.velocityY = 0;
            this.position.y = intersectionBottom.wall.position.y - this.height - 0.01;
            return;
        }
        if (intersectionTop) {
            if (intersectionTop.wall.isDead || this.isDead && (intersectionTop.wall instanceof Entity || intersectionTop.wall instanceof Interactive)) return;
            this.velocityY = 0;
            this.position.y = intersectionTop.wall.position.y + intersectionTop.wall.height + 0.01        
            return;
        }
    }

    killYourselfNOW(context, camera) {
        this.isDead = true;
        this.deathPosition = {x: this.position.x, y: this.position.y}
        if (!this.deathTimeout) {
            this.deathTimeout = setTimeout(() => {
                this.playerOpacity = 100;
                this.position = {...this.respawn};
                this.velocityX = 0;
                this.velocityY = 0;
                this.dx = 0;
                this.isDead = false;
                this.update(context, camera);
                delete this.deathTimeout;
            }, 500);
        }
    }
}