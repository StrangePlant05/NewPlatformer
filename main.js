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
createWall((absoluteCenter() - (stageWidth / 2)  +30 ), heightWindow(100), 900 , 50 , "pink")
createWall(((absoluteCenter() - (stageWidth / 2))  + 1000 ), heightWindow(-800), 90 , 50 , "pink")

let respawn = {}
document.addEventListener("DOMContentLoaded", () => {
    Utils.stageLayout = Utils.loadJsonFile("data/ooh.json")
    if (Utils.stageLayout) {
        Utils.currentStage = new Stage({layout: Utils.stageLayout, cellSize: 40})
        respawn =  { ...Utils.currentStage.spawnPoint };
        startGame(Utils.currentStage);
    }
})

window.addEventListener("beforeunload", (event) => {
    alert("a")
})


// let player1 = new Player({
//     x: respawn.x + 5, 
//     y: respawn.y, 
//     width: 80, 
//     height: 100, 
//     color: "red", 
//     entities: Utils.entities,
//     keybinds: Utils.keybindsPlayer1,
//     walls: Utils.walls
// });
// let player2 = new Player({
//     x: respawn.x - 100,
//     y: respawn.y,
//     width: 50, 
//     height: 70, 
//     color: "blue", 
//     entities: Utils.entities,
//     keybinds: Utils.keybindsPlayer2,
//     walls: Utils.walls
// });

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
    pointA: {
        x: respawn.x + 400,
        y: respawn.y
    },
    pointB: {
        x: respawn.x + 400,
        y: respawn.y - 500
    }
})

Utils.entities.push(object);
Utils.entities.push(object2);
// Utils.entities.push(player1)
// Utils.entities.push(player2)
Utils.walls.push(door)

let player1;
let player2;

let updateRequest;
function startGame(stage) {
    player1 = new Player({
        x: respawn.x, 
        y: respawn.y, 
        width: 80, 
        height: 100, 
        color: "red", 
        entities: Utils.currentStage.entities,
        keybinds: Utils.keybindsPlayer1,
        walls: Utils.currentStage.walls
    });
    player2 = new Player({
        x: respawn.x,
        y: respawn.y,
        width: 50, 
        height: 70, 
        color: "blue", 
        entities: Utils.currentStage.entities,
        keybinds: Utils.keybindsPlayer2,
        walls: Utils.currentStage.walls
    });

    stage.entities.push(player1)
    stage.entities.push(player2)

    update(stage, player1, player2);
}

function stopGame() {
    cancelAnimationFrame(updateRequest);
}
let camera = {
    x: 0,
    y: 0
}
function update(stage, player1, player2) {
    let playerXAverage = (player1.position.x + player2.position.x) / 2
    let cameraOffsetX = (playerXAverage - window.innerWidth /2) * 0.6;
    let playerYAverage = (player1.position.y + player2.position.y) / 2
    let cameraOffsetY = (playerYAverage - window.innerHeight /2) * 0.6;
    camera.x = cameraOffsetX
    camera.y = cameraOffsetY
    context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    stage.walls.forEach(wall => {
        wall.connectedId ? wall.update(context, camera) : wall.draw(context, camera);
    });

    stage.entities.forEach(entity => {
        entity.update(context, camera);
    });

    stage.movables.forEach(movable => {
        movable.update(context, camera);
    });

    stage.buttons.forEach(button => {
        button.update(context, stage.entities, camera);
    });

    updateRequest = requestAnimationFrame(() => update(stage, player1, player2));
}

//update();

// function update() {
//     let playerYAverage = (player1.position.y + player2.position.y) / 2
//     let cameraOffsetY = (playerYAverage - window.innerHeight /2) * 0.6;
//     camera.y = cameraOffsetY
//     context.clearRect(0, 0, window.innerWidth, window.innerHeight);
//     for (let i = 0; i < Utils.walls.length; i++) {
//         Utils.walls[i].draw(context, camera);
//     }

//     if (Utils.getDistance(player1.position, player2.position) > 3000) {
//         player2.position = { ...respawn }
//         player2.velocityX = 0;
//         player2.velocityY = 0;
//         player2.dx = 0;

//         player1.position = { ...respawn }
//         player1.velocityX = 0;
//         player1.velocityY = 0;
//         player1.dx = 0;
//     }
//     player1.update(context, camera);
//     player2.update(context, camera)
//     object.update(context, camera);
//     object2.update(context, camera)
//     plate.update(context, Utils.entities, camera)
//     door.update(context, camera)

//     updateRequest = requestAnimationFrame(update);
// }