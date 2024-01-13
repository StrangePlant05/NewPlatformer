class Stage {
    constructor({ layout, cellSize }) {
        this.cellSize = cellSize;
        this.walls = [];
        this.entities = [];
        this.buttons = [];
        this.spikes = [];
        this.spawnPoint = {};
        this.levelLayout = this.convertToLevelData(layout);

        this.initStage();
    }

    initStage() {
        this.levelLayout.forEach(tile => {
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
                    this.buttons.push(new TriggerBox({id, x, y: y + ((height / 3) * 2), width, height: height / 3, color: "orange"}));
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
                    this.spikes.push(new KillBox({x, y, width, height, color:"red"}));
                    break;
                case 5:
                    this.entities.push(new Prop({x, y, width: width - 0.5, height: height - 0.5, color: "#ad6134", walls: this.walls, entities: this.entities}));
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
        let playerYAverage = (player1.position.y + player2.position.y) / 2
        let cameraOffsetX = (playerXAverage - window.innerWidth /2);
        let cameraOffsetY = (playerYAverage - window.innerHeight /2);
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

        this.spikes.forEach(button => {
            button.update(context, this.entities, camera);
        });

        if (Utils.getDistance(player1.position, player2.position) > 2000) {
            player1.killYourselfNOW();
            player2.killYourselfNOW();
        }
    }

    convertToLevelData(layout) {
        let newTiles = [];
        let seenIds = {};
        for (let i = 0; i < layout.length; i++) {
            if (layout[i].type == 0) continue;
            let newId = layout[i].id;
            let newX = layout[i].x * layout[i].tileSize;
            let newY = layout[i].y * layout[i].tileSize;
            let newWidth = layout[i].tileSize * layout[i].spanColumn;
            let newHeight = layout[i].tileSize * layout[i].spanRow;
            let newType = layout[i].type;
            let newConnectedId = layout[i].connectedId;
            let newMove = {...layout[i].move};
            newMove.x = newX + (newMove.x * layout[i].tileSize);
            newMove.y = newY + (newMove.y * layout[i].tileSize);

            if (seenIds[layout[i].id]) {
                continue;
            }
        
            seenIds[layout[i].id] = true;

            newTiles.push({
                id: newId,
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight,
                type: newType,
                connectedId: newConnectedId,
                move: {...newMove}
            });
        }

        return newTiles;
    }
}