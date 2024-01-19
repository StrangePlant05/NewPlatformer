let jump1 = document.getElementById("jumpPlayer1");
let keynum;
(function(){
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let respawn = {}
    
    document.getElementById("jumpPlayer1").addEventListener('keypress',(event)=>{
        if (event){
            keynum = event.key;
        }
        alert(event.key)
    })
    let timer;
    let totalSeconds = 1;

    document.addEventListener("DOMContentLoaded", () => {                   // load the default level when the page loads and pauses it 
        Utils.stageLayout = Utils.loadJsonFile("data/main.json", null)
        if (Utils.stageLayout) {
            Utils.currentStage = new Stage({layout: Utils.stageLayout, cellSize: 40})
            respawn =  { ...Utils.currentStage.spawnPoint };
            startGame(Utils.currentStage);
            stopGame();
        }
    })
    
    let updateRequest;
    document.getElementById('file').addEventListener('change', (event) => {             // loads a level from a file picker
        stopGame();
        clearTimer();
        Utils.loadJsonFile(null, event.target)
            .then(jsonData => {
                document.getElementById('selectedFile').innerHTML = document.getElementById('file').files[0].name.split('.').slice(0, -1).join('.');
                Utils.currentStage = new Stage({layout: jsonData, cellSize: 40})
                respawn =  { ...Utils.currentStage.spawnPoint };
                startGame(Utils.currentStage);
                startCountUpTimer();
            })
            .catch(error => {
                if (Utils.currentStage) {
                    respawn =  { ...Utils.currentStage.spawnPoint };
                    Utils.currentStage.refreshStage();
                    startGame(Utils.currentStage);
                    startCountUpTimer();
                }
            });
    })
    document.addEventListener("keydown", (event) => {               // handler for jump buttons and destroy buttons
        const eventKey = event.key
        if (eventKey === Utils.keybindsPlayer1.jump && !jumped) {
            player1.jump();
            jumped = true;
        }
        if (eventKey === Utils.keybindsPlayer2.jump && !jumped2) {
            player2.jump();
            jumped2 = true;
        }
        if (eventKey === Utils.keybindsPlayer1.destroy && !destroying1) {
            destroying1 = true;
            player1.destroyBox();
        } 
        if (eventKey === Utils.keybindsPlayer2.destroy && !destroying2) {
            destroying2 = true;
            player2.destroyBox();
        }
        Utils.inputStates[eventKey] = true;
    });
    const displayElement = document.getElementById('timer');
    function startCountUpTimer() {
        timer = setInterval(function () {                           // timer above
            const minutesDisplay = Math.floor(totalSeconds / 60);
            const secondsDisplay = totalSeconds % 60;

            displayElement.textContent = `${String(minutesDisplay).padStart(2, '0')}:${String(secondsDisplay).padStart(2, '0')}`;
            
            totalSeconds++;
        }, 1000);
    }
    function stopTimer() {
        clearInterval(timer);
    }
    function clearTimer() {
        displayElement.textContent = "00:00"
        if (timer) clearInterval(timer);
        totalSeconds = 1;
    }
    
    document.getElementById('play').addEventListener("click", () => {
        continueGame(Utils.currentStage, player1, player2)
        startCountUpTimer();
        document.getElementById('menu').classList.toggle('toggleUpScreen');
    });
    document.getElementById('leaveIcon').addEventListener("click", () => {
        stopGame();
        stopTimer();
        document.getElementById('menu').classList.toggle('toggleUpScreen');
    });
    document.getElementById('restartIcon').addEventListener("click", () => {
        stopGame();
        clearTimer();
        Utils.currentStage.refreshStage();
        startGame(Utils.currentStage);
        startCountUpTimer();
    });
    let player1;
    let player2;
    
    function startGame(stage) {         // modifies the player according to where they are spawned based on the given stage
        player1 = new Player({
            x: respawn.x, 
            y: respawn.y, 
            width: 60, 
            height: 85.4, 
            color: Utils.player1Color, 
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
            color: Utils.player2Color, 
            entities: Utils.currentStage.entities,
            keybinds: Utils.keybindsPlayer2,
            walls: Utils.currentStage.walls,
            respawn,
            jumpStrength: 16,
            speed: 8
        });
    
        stage.entities.push(player1)            // adds the collisions to the stage
        stage.entities.push(player2)

        stage.addFinishListener(()=> {              // time display when it finishes
            stopTimer();
            const finishedTime = totalSeconds-1;
            const minutesDisplay = Math.floor(finishedTime / 60);
            const secondsDisplay = finishedTime % 60;

            const finishedDisplay = `${String(minutesDisplay).padStart(2, '0')}:${String(secondsDisplay).padStart(2, '0')}`;
            const message = `You finished the stage with the time of ${finishedDisplay}!`;
            alert(message);
            stopGame();
            clearTimer();
            Utils.currentStage.refreshStage();
            startGame(Utils.currentStage);
            startCountUpTimer();
        });
    
        update(stage, player1, player2);            
    }

    function continueGame(stage, player1, player2) {
        updateRequest = requestAnimationFrame(() => update(stage, player1, player2));
    }
    
    function stopGame() {
        if (updateRequest) cancelAnimationFrame(updateRequest);
    }
    function update(stage, player1, player2) {      // puts the game in a loop 
        stage.update(context, player1, player2)
        updateRequest = requestAnimationFrame(() => update(stage, player1, player2));
    }
}());
