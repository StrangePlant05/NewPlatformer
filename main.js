let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let respawn = {}

document.addEventListener("DOMContentLoaded", () => {
    Utils.stageLayout = Utils.loadJsonFile("data/aaa.json")
    if (Utils.stageLayout) {
        Utils.currentStage = new Stage({layout: Utils.stageLayout, cellSize: 40})
        respawn =  { ...Utils.currentStage.spawnPoint };
        startGame(Utils.currentStage);
    }
})

let player1;
let player2;

let updateRequest;
function startGame(stage) {
    player1 = new Player({
        x: respawn.x, 
        y: respawn.y, 
        width: 60, 
        height: 80, 
        color: "red", 
        entities: Utils.currentStage.entities,
        keybinds: Utils.keybindsPlayer1,
        walls: Utils.currentStage.walls,
        respawn
    });
    player2 = new Player({
        x: respawn.x,
        y: respawn.y,
        width: 39.4, 
        height: 60, 
        color: "blue", 
        entities: Utils.currentStage.entities,
        keybinds: Utils.keybindsPlayer2,
        walls: Utils.currentStage.walls,
        respawn
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
    stage.update(context, player1, player2)
    updateRequest = requestAnimationFrame(() => update(stage, player1, player2));
}