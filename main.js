let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let respawn = {}

document.addEventListener("DOMContentLoaded", () => {
    Utils.stageLayout = Utils.loadJsonFile("data/aaaaa.json", null)
    if (Utils.stageLayout) {
        Utils.currentStage = new Stage({layout: Utils.stageLayout.tiles, cellSize: 40})
        respawn =  { ...Utils.currentStage.spawnPoint };
        startGame(Utils.currentStage);
    }

    console.log("aaa")
})

document.getElementById('file').addEventListener('change', (event) => {
    Utils.loadJsonFile(null, event.target)
        .then(jsonData => {
            try {
                Utils.currentStage = new Stage({layout: jsonData.tiles, cellSize: 40})
                respawn =  { ...Utils.currentStage.spawnPoint };
                startGame(Utils.currentStage);
            } catch(e) {
                Utils.currentStage = new Stage({layout: jsonData, cellSize: 40})
                respawn =  { ...Utils.currentStage.spawnPoint };
                startGame(Utils.currentStage);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
})

let player1;
let player2;

let updateRequest;
function startGame(stage) {
    player1 = new Player({
        x: respawn.x, 
        y: respawn.y, 
        width: 58, 
        height: 85.4, 
        color: "red", 
        entities: Utils.currentStage.entities,
        keybinds: Utils.keybindsPlayer1,
        walls: Utils.currentStage.walls,
        respawn,
        jumpStrength: 14,
        speed: 5
    });
    player2 = new Player({
        x: respawn.x,
        y: respawn.y,
        width: 58, 
        height: 58, 
        color: "blue", 
        entities: Utils.currentStage.entities,
        keybinds: Utils.keybindsPlayer2,
        walls: Utils.currentStage.walls,
        respawn,
        jumpStrength: 16,
        speed: 8
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
