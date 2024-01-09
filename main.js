let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stageWidth = 1920;

function createWall(x,y,width,height,color){
Utils.walls.push(new Sprite({ x, y, width, height, color }))
}
function heightWindow(x){
    return  window.innerHeight + x;
}
function widthWindow(x){
    return window.innerWidth / x
}
function absoluteCenter(){
    return (window.innerWidth /2)
}


createWall(absoluteCenter() - (stageWidth / 2), heightWindow(25), stageWidth , 50, "red")
//createWall(x,y,width,height,color)
createWall((absoluteCenter() - (stageWidth / 2)  +30 ), heightWindow(100), 900 , 50 , "pink")
createWall(((absoluteCenter() - (stageWidth / 2))  + 1000 ), heightWindow(-800), 90 , 50 , "pink")

document.addEventListener("DOMContentLoaded", () => {
    Utils.stageLayout = Utils.loadJsonFile("data/tilesuwu.json")
    if (Utils.stageLayout) console.log(Utils.stageLayout);
})

// createWall(500, heightWindow(-200), stageWidth/1.5, 50, "orange")
// createWall(100, heightWindow(-500), 50, window.innerHeight - 200)
// createWall(900, heightWindow(-10), 50, window.innerHeight - 200, "pink")


let respawn = {
    x: (window.innerWidth / 2), 
    y: heightWindow(-100), 
}
let player1 = new Player({
    x: respawn.x + 5, 
    y: respawn.y, 
    width: 80, 
    height: 100, 
    color: "red", 
    entities: Utils.entities,
    keybinds: Utils.keybindsPlayer1,
    walls: Utils.walls
});
let player2 = new Player({
    x: respawn.x - 100,
    y: respawn.y,
    width: 50, 
    height: 70, 
    color: "blue", 
    entities: Utils.entities,
    keybinds: Utils.keybindsPlayer2,
    walls: Utils.walls
});

let object = new Prop({
    x: respawn.x + 15,
    y: respawn.y-2000,
    width: 50,
    height: 50,
    color: "#7f3f00",
    entities: Utils.entities,
    walls: Utils.walls,
    speed: 10,
    gravity: 0.8
})

let object2 = new Prop({
    x: respawn.x + 20,
    y: respawn.y,
    width: 60,
    height: 110,
    color: "#7f3f00",
    entities: Utils.entities,
    walls: Utils.walls,
    speed: 10,
    gravity: 0.8
})

let plate = new TriggerBox({
    x: respawn.x + 200,
    y: heightWindow(10),
    width: 50,
    height: 15,
    color: "pink"
})

let door = new Interactive({
    x: respawn.x + 400,
    y: respawn.y,
    width: 300,
    height: 250,
    plate: plate,
    color: "pink",
    pointAX: respawn.x + 400,
    pointAY: respawn.y,
    pointBX: respawn.x + 400,
    pointBY: respawn.y - 500,    
})

Utils.entities.push(object);
Utils.entities.push(object2);
Utils.entities.push(player1)
Utils.entities.push(player2)
Utils.walls.push(door)

let camera = {
    x: 0,
    y: 0
}
update();
function update() {
    let playerYAverage = (player1.position.y + player2.position.y) / 2
    let cameraOffsetY = (playerYAverage - window.innerHeight /2) * 0.6;
    camera.y = cameraOffsetY
        // context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        // for(let i = 0; i < Utils.walls.length; i++) {
        //     Utils.walls[i].position.y -= cameraOffsetY;
        //     Utils.walls[i].draw(context);
        // }
        // player1.position.y -= cameraOffsetY;
        // player2.position.y -= cameraOffsetY;
        // object.position.y -= cameraOffsetY;
        // object2.position.y -= cameraOffsetY
        // respawn.y -= cameraOffsetY;
        // plate.position.y -= cameraOffsetY;

        // door.position.y -= cameraOffsetY;
        // door.pointAY -= cameraOffsetY;
        // door.pointBY -= cameraOffsetY;

        // camera.y += cameraOffsetY;

    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw the static objects (walls, plate, door, etc.) without modifying their positions
    for (let i = 0; i < Utils.walls.length; i++) {
        Utils.walls[i].draw(context, camera);
    }

    // Draw the player and other dynamic objects with respect to the camera position
    // player1.draw(context, camera);
    // player2.draw(context, camera);
    // object.draw(context, camera);
    // object2.draw(context, camera);
    // respawn.draw(context, camera);
    // plate.draw(context, camera);
    // door.draw(context, camera);

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
    player1.update(context, camera);
    player2.update(context, camera)
    object.update(context, camera);
    object2.update(context, camera)
    plate.update(context, Utils.entities, camera)
    door.update(context, camera)
    
    
    // context.fillStyle = "green"
    // context.fillRect(respawn.x, respawn.y, 10, 10)
    
    requestAnimationFrame(update);
}

