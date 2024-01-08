class Stage {
    constructor({ layout, cellSize }) {
        this.wallsLayout = layout;
        this.cellSize = cellSize;
        this.walls = [];
        this.entities = [];
        this.buttons = [];
    }

    initStage() {
        for (let y = 0; y < this.wallsLayout.length; y++) {
            for (let x = 0; y < this.wallsLayout[y].length; x++) {
                switch (this.wallsLayout[y][x]) {
                    case 1: 
                        this.walls.push(new Sprite({x: x * this.cellSize, y: y * this.cellSize, width: this.cellSize, height: this.cellSize, color: "#000"}));
                        break;
                    case 2: 
                        this.buttons.push(new TriggerBox({x: x * this.cellSize, y: y * this.cellSize + (this.cellSize / 2), width: this.cellSize, height: (this.cellSize / 2), color: "orange"}))
                        break;
                }
            }
        }
    }
    update(context) {

    }
}