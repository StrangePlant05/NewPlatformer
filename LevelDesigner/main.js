let levelDisplay = document.getElementById('levelDisplay');

let tileXInput = document.getElementById('tileX')
let tileYInput = document.getElementById('tileY')
let tileSizeInput = document.getElementById('tileSize')
let refreshButton = document.getElementById('refresh')
let hideButton = document.getElementById('hide')
let submitButton = document.getElementById('submit')
let lockButton = document.getElementById('lock')
let connectButton = document.getElementById('connect')

let brushSelect = document.getElementsByName('brushSelect')

let typeInput = document.getElementById('tileType');
let idInput = document.getElementById('tileId');
let spanRowInput = document.getElementById('spanRow');
let spanColumnInput = document.getElementById('spanColumn');
let moveXInput = document.getElementById('moveX');
let moveYInput = document.getElementById('moveY');
let idConnectInput = document.getElementById('idConnect');

let selectedTile;

let uiToggle = true;
let lock = false;

let tiles = [];
let displayTiles = [];

let tileX;
let tileY;
let tileSize;
let connectingId = false;

let colors = [
    "#00000000",
    "black",
    "orange",
    "brown",
    "red",
    "#ad6134",
    "green",
    "yellow",
    "#34ebe8",
    "#32e641"
]

refreshButton.addEventListener("click", () => {
    refreshDisplay();
});
lockButton.addEventListener("click", () => {
    tileX = parseInt(tileXInput.value);
    tileY = parseInt(tileYInput.value);
    tileSize = parseInt(tileSizeInput.value);
    refreshDisplay();
    tileXInput.disabled = true;
    tileYInput.disabled = true;
    tileSizeInput.disabled = true;

    lock = true;
});

hideButton.addEventListener("click", () => {
    toggleUi();
});

connectButton.addEventListener("click", () => {
    connectingId = true;
    toggleUi();
});

submitButton.addEventListener("click", () => {
    exportToJson();
});

function toggleUi() {
    uiToggle = !uiToggle;
    let display = uiToggle ? "flex" : "none";
    let width = uiToggle ? "20vw" : "fit-content"
    let height = uiToggle ? "80vh" : "fit-content"
    document.getElementById("levelProperties").style.display = display;
    document.getElementById("tileProperties").style.display = display;
    document.getElementById("brush").style.display = display;
    document.getElementById("level").style.width = width;
    document.getElementById("level").style.height = height;
    refreshButton.style.display = display;
    submitButton.style.display = display;
}

function refreshDisplay() {
    if (lock) {
        tiles.forEach(e => {
            e.tile.style.background = colors[e.type]            // changes the color of the tiles based on their type
        });
    } else {
        tiles = [];
        levelDisplay.innerHTML = '';
    
        if (Number.isInteger(tileX) && Number.isInteger(tileY) && Number.isInteger(tileSize)) {         
            for (let y = 0; y < tileY; y++) {
                let row = document.createElement("div");
                for (let x = 0; x < tileX; x++) {               // creates a grid of empty tiles that you could modify
                    let tile = document.createElement("div");
                    tile.style.width = tileSize + "px";
                    tile.style.height = tileSize + "px";
                    tile.style.borderWidth = "1px";
                    tile.style.border = "solid";
                    tile.style.borderColor = "#b2b2b250";
                    tile.style.userSelect = "none"
                    tile.style.display = "grid"
                    tile.style.placeItems = "center"
                    tile.addEventListener("click", () => {
                        tileClick(tile);
                    })
                    row.appendChild(tile);

                    tiles.push({
                        id: x + ":" + y  + ":" + 0,
                        x,
                        y,
                        tileSize,
                        spanRow: 1,
                        spanColumn: 1,
                        type: 0,
                        tile, 
                        connectedId: [],
                        move: {
                            x: 0,
                            y: 0
                        }
                    })
                }
                levelDisplay.appendChild(row);
            }
        }
    }
}

function tileClick(tile) {          // modify or create tiles
    if (connectingId) {
        tiles.forEach(e => {
            if (e.tile == tile) {
                selectedTile.connectedId.push(e.id);
                connectingId = false;
                toggleUi();
                selectedTile.tile.innerHTML = 'o';      // connects a platform or door with a button 
                typeInput.value = selectedTile.type;
                idInput.value = selectedTile.id;
                spanRowInput.value = selectedTile.spanRow;
                spanColumnInput.value = selectedTile.spanColumn;
                idConnectInput.value = JSON.stringify(selectedTile.connectedId);
                return;
            }
        });
    } else {
        let currentTile;
        tiles.forEach(e => {
            e.tile.innerHTML = '';
            if (e.tile == tile) {
                currentTile = e;
                let type;
                for (let i = 0; i < brushSelect.length; i++) {
                    type = 0;
                    if (brushSelect[i].checked) {
                        type = i;
                        break;
                    }
                }
                type -= 1;
                selectedTile = currentTile;                 
                currentTile.tile.innerHTML = 'o';
                typeInput.value = currentTile.type;         // puts the data on display for a selected tile
                idInput.value = currentTile.id;
                spanRowInput.value = currentTile.spanRow;
                spanColumnInput.value = currentTile.spanColumn;
                moveXInput.value = currentTile.move.x;
                moveYInput.value = currentTile.move.y;
                idConnectInput.value = JSON.stringify(currentTile.connectedId);
    
                if (type > colors.length - 1 || type == -1) return;   
                currentTile.type = type;
                currentTile.id = currentTile.x + ":" + currentTile.y + ":" + type;
                refreshDisplay();
                return;
            }
        });
    }
}

spanColumnInput.addEventListener("input", () => {           // used to span columns and rows and affects the tiles it uses
    let newSpan = parseInt(spanColumnInput.value)
    if (selectedTile) {
        if (newSpan >= 1 && (newSpan + selectedTile.x) <= tileX) {
            for (let j = 0; j < selectedTile.spanRow; j++) {
                for (let i = selectedTile.x; i < selectedTile.spanColumn + selectedTile.x; i++) {
                    let oldSpan = tiles.filter((tile) => { return tile.x == i && tile.y == selectedTile.y + j});
                    oldSpan.forEach(tile => {
                        if (!(tile == selectedTile) && tile.id == selectedTile.id) {
                            tile.spanColumn = 1;
                            tile.type = 0;
                            tile.id = tile.x + ":" + tile.y + ":" + 0;
                        }
                    });
                }
                for (let i = selectedTile.x; i < newSpan + selectedTile.x; i++) {
                    let span = tiles.filter((tile) => { return tile.x == i && tile.y == selectedTile.y + j});
                    span.forEach(tile => {
                        if (tile.type == 0) {
                            tile.id = selectedTile.id;
                            tile.type = selectedTile.type;
                        }
                    });
                }
            }
            selectedTile.spanColumn = newSpan;
        }
        refreshDisplay();
    }
});

spanRowInput.addEventListener("input", () => {
    let newSpan = parseInt(spanRowInput.value)
    if (selectedTile) {
        if (newSpan >= 1 && (newSpan + selectedTile.y) <= tileY) {
            for (let j = 0; j < selectedTile.spanColumn; j++) {
                for (let i = selectedTile.y; i < selectedTile.spanRow + selectedTile.y; i++) {
                    let oldSpan = tiles.filter((tile) => { return tile.y == i && tile.x == selectedTile.x + j});
                    console.log(i)
                    oldSpan.forEach(tile => {
                        if (!(tile == selectedTile) && tile.id == selectedTile.id) {
                            tile.spanRow = 1;
                            tile.type = 0;
                            tile.id = tile.x + ":" + tile.y + ":" + 0;
                        }
                    });
                }
                for (let i = selectedTile.y; i < newSpan + selectedTile.y; i++) {
                    let span = tiles.filter((tile) => { return tile.y == i && tile.x == selectedTile.x + j});
                    span.forEach(tile => {
                        if (tile.type == 0) {
                            tile.id = selectedTile.id;
                            tile.type = selectedTile.type;
                        }
                    });
                }
            }
            selectedTile.spanRow = newSpan;
        }
        refreshDisplay();
    }
});

moveXInput.addEventListener("input", () => {                // adds a data to use for platforms for moving it
    if (selectedTile && moveXInput.value != '') {
        if (selectedTile.type == 7) {
            let moveX = parseInt(moveXInput.value);
            if (!(moveX + selectedTile.x < 0) && !(moveX + selectedTile.x + selectedTile.spanColumn > tileX)) {
                selectedTile.move.x = moveX;
            }
        } else {
            moveXInput.value = 0;
        }
    }
});

moveYInput.addEventListener("input", () => {
    if (selectedTile && moveXInput.value != '') {
        if (selectedTile.type == 7) {
            let moveY = parseInt(moveYInput.value);
            if (!(moveY + selectedTile.y < 0) && !(moveY + selectedTile.Y + selectedTile.spanRow > tileY)) {
                selectedTile.move.y = moveY;
            }
        } else {
            moveXInput.value = 0;
        }
    }
});

idConnectInput.addEventListener("input", () => {            // starts the connection for a door or platform to a button
    let inputText = "[" + idConnectInput.value + "]";
    try {
        let newIds = JSON.parse(inputText);
        selectedTile.connectedId = newIds;
    } catch (e) {
        idConnectInput.value = JSON.stringify(selectedTile.connectedId);
    }
});

function exportToJson() {
    let newJson = {
        project: {
            tileX,
            tileY,
            tileSize
        },
        tiles
    }

    var jsonString = JSON.stringify(newJson, null, 2);          // add the project grid values and the tiles into a json file and exports it

    var blob = new Blob([jsonString], { type: "application/json" });

    var downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "tiles.json";

    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);
}

document.getElementById('file').addEventListener('input', (event) => {
    Utils.loadJsonFile(null, event.target)
        .then(jsonData => {
            levelDisplay.innerHTML = '';
            tiles = jsonData.tiles;
            tileX = jsonData.project.tileX;
            tileY = jsonData.project.tileY;
            tileSize = jsonData.project.tileSize;
            lock = true;

            let row;
            for (let i = 0; i < tiles.length; i++) {
                if (i % tileX == 0) {
                    !!row ? levelDisplay.appendChild(row) : row = document.createElement("div");
                }
                if (i % tileX == 0) {
                    row = document.createElement("div");
                    console.log("a")
                }
                let tile = document.createElement("div");
                tile.style.width = tileSize + "px";
                tile.style.height = tileSize + "px";
                tile.style.borderWidth = "1px";             // loads a file, turns them into tile data for the editor
                tile.style.border = "solid";
                tile.style.borderColor = "#b2b2b250";
                tile.style.userSelect = "none"
                tile.style.display = "grid"
                tile.style.placeItems = "center"
                tile.style.background = colors[tiles[i].type]
                tiles[i].tile = tile;
                tile.addEventListener("click", () => {
                    tileClick(tile);
                })
                row.appendChild(tile);
            }

            refreshDisplay();
            tileXInput.disabled = true;
            tileYInput.disabled = true;
            tileSizeInput.disabled = true;

            lock = true;
        })
        .catch(error => {
            console.error('Error:', error);
        });
})