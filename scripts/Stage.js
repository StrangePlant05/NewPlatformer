class Stage {
    constructor({ layout, cellSize }) {
        this.layout = layout;
        this.cellSize = cellSize;
        this.walls = [];
        this.movables = [];
        this.entities = [];
        this.buttons = [];
        this.spawnPoint = {};


        this.initStage();
    }

    initStage() {
        this.layout.forEach(tile => {
            let x = tile.x;
            let y = tile.y;
            let width = tile.width;
            let height = tile.height;
            let type = tile.type;
            let connectedId = tile.connectedId;
            let id = tile.id;
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
                    console.log(this.spawnPoint)
                    break;
            }
        });
    }
    update(context) {
        
    }
}