class Sprite {
    constructor({x, y, width, height, color}) {
        this.position = {
            x: x,
            y: y
        }
        this.width = width;
        this.height = height;
        this.color = color;
    }
    draw(context, camera) {         // draw anything based on the position, camera position, size and such
        context.fillStyle = this.color;
        context.fillRect(this.position.x - camera.x, this.position.y - camera.y, this.width, this.height);
    }
}