(function(){
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let respawn = {}
    
    document.addEventListener("DOMContentLoaded", () => {
        Utils.stageLayout = Utils.loadJsonFile("data/aaaaa.json", null)
        if (Utils.stageLayout) {
            Utils.currentStage = new Stage({layout: Utils.stageLayout, cellSize: 40})
            respawn =  { ...Utils.currentStage.spawnPoint };
            startGame(Utils.currentStage);
        }
    })
    
    let updateRequest;
    document.getElementById('file').addEventListener('change', (event) => {
        stopGame();
        Utils.loadJsonFile(null, event.target)
            .then(jsonData => {
                Utils.currentStage = new Stage({layout: jsonData, cellSize: 40})
                respawn =  { ...Utils.currentStage.spawnPoint };
                startGame(Utils.currentStage);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    })
    document.addEventListener("keydown", (event) => {
        const eventKey = event.key.toLowerCase();
        if (eventKey === Utils.keybindsPlayer1.jump && !jumped) {
            player1.jump();
            jumped = true;
        }
        if (eventKey === Utils.keybindsPlayer2.jump && !jumped2) {
            player2.jump();
            jumped2 = true;
        }
        Utils.inputStates[eventKey] = true;
    });
    
    let player1;
    let player2;
    
    function startGame(stage) {
        player1 = new Player({
            x: respawn.x, 
            y: respawn.y, 
            width: 58, 
            height: 85.4, 
            color: "#ff0000", 
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
            color: "#0000ff", 
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
        if (updateRequest) cancelAnimationFrame(updateRequest);
    }
    let camera = {
        x: 0,
        y: 0
    }
    function update(stage, player1, player2) {
        stage.update(context, player1, player2)
        updateRequest = requestAnimationFrame(() => update(stage, player1, player2));
    }
}());
