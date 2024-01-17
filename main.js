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

    document.addEventListener("DOMContentLoaded", () => {
        Utils.stageLayout = Utils.loadJsonFile("data/aaaaa.json", null)
        if (Utils.stageLayout) {
            Utils.currentStage = new Stage({layout: Utils.stageLayout, cellSize: 40})
            respawn =  { ...Utils.currentStage.spawnPoint };
            startGame(Utils.currentStage);
            stopGame();
        }
    })
    
    let updateRequest;
    document.getElementById('file').addEventListener('change', (event) => {
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
    let timer;
    let totalSeconds = 1;
    const displayElement = document.getElementById('timer');
    function startCountUpTimer() {

        timer = setInterval(function () {
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
    
    function startGame(stage) {
        player1 = new Player({
            x: respawn.x, 
            y: respawn.y, 
            width: 58, 
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
    
        stage.entities.push(player1)
        stage.entities.push(player2)
    
        update(stage, player1, player2);
    }

    function continueGame(stage, player1, player2) {
        updateRequest = requestAnimationFrame(() => update(stage, player1, player2));
    }
    
    function stopGame() {
        if (updateRequest) cancelAnimationFrame(updateRequest);
    }
    function update(stage, player1, player2) {
        stage.update(context, player1, player2)
        updateRequest = requestAnimationFrame(() => update(stage, player1, player2));
    }
}());
