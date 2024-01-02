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
    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}