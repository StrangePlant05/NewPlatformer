class Stage {
    constructor({ walls, players, entities, triggers, spawnPoint}) {
        this.walls = walls;
        this.players = players
        this.entities = entities;
        this.triggers = triggers    
        this.spawnPoint = spawnPoint

        wallsLayout = [
             
        ]
    }

    createWalls(wallsLayout) {
        
    }


    update(context) {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        let playerXAverage = (player1.position.x + player2.position.x) / 2;
        let playerYAverage = (player1.position.y + player2.position.y) / 2
        let cameraOffsetX = (playerXAverage - window.innerWidth /2) * 0.1;
        let cameraOffsetY = (playerYAverage - window.innerHeight /2) * 0.1;
        for(let i = 0; i < Utils.walls.length; i++) {
            Utils.walls[i].position.x -= cameraOffsetX;
            Utils.walls[i].position.y -= cameraOffsetY;
            Utils.walls[i].draw(context);
        }
        // Camera Head
        player1.position.x -= cameraOffsetX;
        player1.position.y -= cameraOffsetY;
        
        player2.position.x -= cameraOffsetX;
        player2.position.y -= cameraOffsetY;
        
        object.position.x -= cameraOffsetX;
        object.position.y -= cameraOffsetY;

        spawnPoint.x -= cameraOffsetX;
        spawnPoint.y -= cameraOffsetY;


        if (Utils.getDistance(player1.position, player2.position) > 3000) {
            player2.position = { ...spawnPoint }
            player2.velocityX = 0;
            player2.velocityY = 0;
            player2.dx = 0;

            player1.position = { ...spawnPoint }
            player1.velocityX = 0;
            player1.velocityY = 0;
            player1.dx = 0;
        }
        player1.update(context);
        player2.update(context)
        object.update(context);
        
        
        context.fillStyle = "green"
        context.fillRect(spawnPoint.x, spawnPoint.y, 10, 10)
    }
}