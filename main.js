let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

Utils.walls.push(new Sprite({ x: 100, y: window.innerHeight - 200, width: window.innerWidth - 200, height: 50, color: "#000" }));
Utils.walls.push(new Sprite({ x: 100, y: 100, width: 50, height: window.innerHeight - 200, color: "#000" }));
let player = new Player({
    x: window.innerWidth / 2, 
    y: window.innerHeight - 500, 
    width: 50, 
    height: 50, 
    color: "red", 
    entities: Utils.walls
});
update();

function update() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for(let i = 0; i < Utils.walls.length; i++) {
        Utils.walls[i].draw(context);
    }
    player.update(context);
    requestAnimationFrame(update);
}