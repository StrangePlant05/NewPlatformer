class Stage {
    constructor({ layout, cellSize }) {
        this.cellSize = cellSize;
        this.walls = [];
        this.entities = [];
        this.buttons = [];
        this.spikes = [];
        this.spawnPoint = {};
        this.levelLayout = this.convertToLevelData(layout.tiles);
        this.stageBounds = {
            x: 0,
            y: 0,
            width: layout.project.tileX * layout.project.tileSize,
            height: layout.project.tileY * layout.project.tileSize,
        }

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
                    this.spikes.push(new KillBox({x, y: y + (height / 2), width, height: height / 2, color:"red"}));
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

        if (player1.position.y > this.stageBounds.height) {
            player1.killYourselfNOW();
        }
        if (player2.position.y > this.stageBounds.height) {
            player2.killYourselfNOW();
        }
    }

    convertToLevelData(tiles) {
        let newTiles = [];
        let seenIds = {};
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i].type == 0) continue;
            let newId = tiles[i].id;
            let newX = tiles[i].x * tiles[i].tileSize;
            let newY = tiles[i].y * tiles[i].tileSize;
            let newWidth = tiles[i].tileSize * tiles[i].spanColumn;
            let newHeight = tiles[i].tileSize * tiles[i].spanRow;
            let newType = tiles[i].type;
            let newConnectedId = tiles[i].connectedId;
            let newMove = {...tiles[i].move};
            newMove.x = newX + (newMove.x * tiles[i].tileSize);
            newMove.y = newY + (newMove.y * tiles[i].tileSize);

            if (seenIds[tiles[i].id]) {
                continue;
            }
        
            seenIds[tiles[i].id] = true;

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