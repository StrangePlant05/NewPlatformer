let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

Utils.walls.push(new Sprite({ x: 500, y: window.innerHeight - 200, width: window.innerWidth/1.5, height: 50, color: "#000" }));
Utils.walls.push(new Sprite({ x: 100, y: window.innerHeight + 500, width: 4000 , height: 50, color: "#000" }));
Utils.walls.push(new Sprite({ x: 100, y: window.innerHeight - 500, width: 50, height: window.innerHeight - 200, color: "#000" }));
Utils.walls.push(new Sprite({ x: 900, y: window.innerHeight - 500, width: 50, height: window.innerHeight - 200, color: "#000" }));


let player1 = new Player({
    x: window.innerWidth / 1.8, 
    y: 600, 
    width: 50, 
    height: 90, 
    color: "red", 
    entities: Utils.entities,
    keybinds: Utils.keybindsPlayer1,
    walls: Utils.walls
});
let player2 = new Player({
    x: window.innerWidth / 2, 
    y: 600, 
    width: 50, 
    height: 70, 
    color: "blue", 
    entities: Utils.entities,
    keybinds: Utils.keybindsPlayer2,
    walls: Utils.walls
});

let object = new Prop({
    x: window.innerWidth / 2.4,
    y: 600,
    width: 50,
    height: 50,
    color: "yellow",
    entities: Utils.entities,
    walls: Utils.walls,
    speed: 10,
    gravity: 0.8
})

Utils.entities.push(object);
Utils.entities.push(player1)
Utils.entities.push(player2)

let respawn = {
    x: (window.innerWidth / 2), 
    y: 600, 
}

update();
function update() {
    let playerXAverage = (player1.position.x + player2.position.x) / 2;
    let playerYAverage = (player1.position.y + player2.position.y) / 2
    let cameraOffsetX = (playerXAverage - window.innerWidth /2) * 0.1;
    let cameraOffsetY = (playerYAverage - window.innerHeight /2) * 0.1;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for(let i = 0; i < Utils.walls.length; i++) {
        Utils.walls[i].position.x -= cameraOffsetX;
        Utils.walls[i].position.y -= cameraOffsetY;
        Utils.walls[i].draw(context);
    }
    player1.position.x -= cameraOffsetX;
    player2.position.x -= cameraOffsetX;
    object.position.x -= cameraOffsetX;
    respawn.x -= cameraOffsetX;
    player1.position.y -= cameraOffsetY;
    player2.position.y -= cameraOffsetY;
    object.position.y -= cameraOffsetY;
    respawn.y -= cameraOffsetY;


    if (Utils.getDistance(player1.position, player2.position) > 3000) {
        player2.position = { ...respawn }
        player2.velocityX = 0;
        player2.velocityY = 0;
        player2.dx = 0;

        player1.position = { ...respawn }
        player1.velocityX = 0;
        player1.velocityY = 0;
        player1.dx = 0;
    }
    player1.update(context);
    player2.update(context)
    object.update(context);
    
    
    context.fillStyle = "green"
    context.fillRect(respawn.x, respawn.y, 10, 10)
    
    requestAnimationFrame(update);
}

