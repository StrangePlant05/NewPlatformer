let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

Utils.entities.push(new Sprite(100, window.innerHeight - 200, window.innerWidth - 200, 50, "#000"));
Utils.entities.push(new Sprite(100, 100, 50, window.innerHeight - 200, "#000"));
let player = new Player(window.innerWidth / 2, window.innerHeight - 500, 50, 50, "red", Utils.entities);
update();

function update() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for(let i = 0; i < Utils.entities.length; i++) {
        Utils.entities[i].draw(context);
    }
    player.update(context);
    requestAnimationFrame(update);
}