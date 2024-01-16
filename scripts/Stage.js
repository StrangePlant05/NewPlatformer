class Stage {
    constructor({ layout, cellSize }) {
        this.cellSize = cellSize;
        this.walls = [];
        this.entities = [];
        this.buttons = [];
        this.spikes = [];
        this.checkpoints = [];
        this.spawnPoint = {};
        this.levelLayout = this.convertToLevelData(layout.tiles);
        this.stageBounds = {
            x: 0,
            y: 0,
            width: layout.project.tileX * layout.project.tileSize,
            height: layout.project.tileY * layout.project.tileSize,
        }
        this.refreshStage();
        this.camera = undefined;
    }

    refreshStage() {
        this.walls = [];
        this.entities = [];
        this.buttons = [];
        this.spikes = [];
        this.checkpoints = [];
        this.spawnPoint = {};
        this.levelLayout.forEach(tile => {
            let x = tile.x;
            let y = tile.y;
            let width = tile.width + 0.5;
            let height = tile.height + 0.5;
            let type = tile.type;
            let connectedId = tile.connectedId;
            let id = tile.id;
            let move = tile.move;
            let color = Utils.colors[type];
            switch (type) {
                case 1:
                    this.walls.push(new Sprite({x, y, width, height, color}));
                    break;
                case 2:
                    this.buttons.push(new TriggerBox({id, x, y: y + ((height / 3) * 2), width, height: height / 3, color}));
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
                    this.walls.push(new Interactive({x, y, width, height, connectedId, color, pointA, pointB }));
                    break;  
                case 4:
                    this.spikes.push(new KillBox({x, y: y + (height / 2), width, height: height / 2, color}));
                    break;
                case 5:
                    this.entities.push(new Prop({x, y, width: width - 0.5, height: height - 0.5, color, walls: this.walls, entities: this.entities}));
                    break;
                case 6:
                    this.spawnPoint = { x, y };
                    this.camera = {...this.spawnPoint}
                    break;
                case 7:
                    let pointAMovable = {
                        x: tile.x,
                        y: tile.y
                    }
                    let pointBMovable = {...move};
                    this.walls.push(new Interactive({x, y, width, height, connectedId, color, pointA: pointAMovable, pointB: pointBMovable}))
                    break;
                case 8:
                    this.checkpoints.push(new Checkpoint({id, x, y, width: width - 0.5, height: height - 0.5, color}));
                    break;
                case 9:
                    this.checkpoints.push(new Finish({x, y, width: width - 0.5, height: height - 0.5, color}));
                    break;
            }
            this.camera = undefined;
        });
    }
    update(context, player1, player2) {
        let playerXAverage = (player1.position.x + player2.position.x) / 2
        let playerYAverage = (player1.position.y + player2.position.y) / 2
        let cameraOffsetX = (playerXAverage - window.innerWidth /2);
        let cameraOffsetY = (playerYAverage - window.innerHeight /2);
        if (!this.camera) {
            this.camera = {
                x: cameraOffsetX,
                y: cameraOffsetY
            }
        } else {
            let smoothness = 0.1;
            let newCameraOffsetX = Utils.lerp(this.camera.x, cameraOffsetX, smoothness);
            let newCameraOffsetY = Utils.lerp(this.camera.y, cameraOffsetY, smoothness);
            this.camera = {
                x: newCameraOffsetX,
                y: newCameraOffsetY
            }
        }

        context.clearRect(0, 0, window.innerWidth, window.innerHeight)
        this.checkpoints.forEach(button => {
            button.update(context, this.entities, this.camera);
        });
        this.spikes.forEach(button => {
            button.update(context, this.entities, this.camera);
        });
        this.walls.forEach(wall => {
            wall.connectedId ? wall.update(context, this.camera) : wall.draw(context, this.camera);
        });
    
        this.entities.forEach(entity => {
            entity.update(context, this.camera);
        });
    
        this.buttons.forEach(button => {
            button.update(context, this.entities, this.camera);
        });


        if (Utils.getDistance(player1.position, player2.position) > 2000 && (!player1.isDead && !player2.isDead)) {
            player1.killYourselfNOW(context, this.camera);
            player2.killYourselfNOW(context, this.camera);
        }

        if (player1.position.y > this.stageBounds.height) {
            player1.killYourselfNOW(context, this.camera);
        }
        if (player2.position.y > this.stageBounds.height) {
            player2.killYourselfNOW(context, this.camera);
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
    finishStage() {
        
    }
}