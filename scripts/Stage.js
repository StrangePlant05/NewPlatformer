class Stage {
    constructor({ layout, cellSize }) {
        this.layout = layout;
        this.cellSize = cellSize;
        this.walls = [];
        this.entities = [];
        this.buttons = [];
        this.spawnPoint = {};

        this.initStage();
    }

    initStage() {
        this.layout.forEach(tile => {
            let x = tile.x;
            let y = tile.y;
            let width = tile.width + 0.5;
            let height = tile.height + 0.5;
            let type = tile.type;
            let connectedId = tile.connectedId;
            let id = tile.id;
            let move = tile.move;
            switch (type) {
                case 1:
                    this.walls.push(new Sprite({x, y, width, height, color: "black"}));
                    break;
                case 2:
                    this.buttons.push(new TriggerBox({id, x, y, width, height, color: "orange"}));
                    break;
                case 3: 
                    let pointA = {
                        x: tile.x,
                        y: tile.y
                    }
                    let pointB = {
                        x: tile.x,
                        y: tile.y - height
                    }
                    this.walls.push(new Interactive({x, y, width, height, connectedId, color: "brown", pointA, pointB }));
                    break;  
                case 4:
                    // spike
                    break;
                case 5:
                    this.entities.push(new Prop({x, y, width, height, color: "#ad6134", walls: this.walls, entities: this.entities}));
                    break;
                case 6:
                    this.spawnPoint = { x, y };
                    break;
                case 7:
                    let pointAMovable = {
                        x: tile.x,
                        y: tile.y
                    }
                    let pointBMovable = {...move};
                    this.walls.push(new Interactive({x, y, width, height, connectedId, color: "yellow", pointA: pointAMovable, pointB: pointBMovable}))
                    break;
            }
        });
    }
    update(context, player1, player2) {
        let playerXAverage = (player1.position.x + player2.position.x) / 2
        let cameraOffsetX = (playerXAverage - window.innerWidth /2) * 0.6;
        let playerYAverage = (player1.position.y + player2.position.y) / 2
        let cameraOffsetY = (playerYAverage - window.innerHeight /2) * 0.6;
        camera.x = cameraOffsetX
        camera.y = cameraOffsetY

        context.clearRect(0, 0, window.innerWidth, window.innerHeight)
        this.walls.forEach(wall => {
            wall.connectedId ? wall.update(context, camera) : wall.draw(context, camera);
        });
    
        this.entities.forEach(entity => {
            entity.update(context, camera);
        });
    
        this.buttons.forEach(button => {
            button.update(context, this.entities, camera);
        });

        if (Utils.getDistance(player1.position, player2.position) > 2000) {
            player1.killYourselfNOW();
            player2.killYourselfNOW();
        }
    }
}