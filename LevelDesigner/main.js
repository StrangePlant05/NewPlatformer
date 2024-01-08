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
    "green"
]

refreshButton.addEventListener("click", () => {
    refreshDisplay();
});
lockButton.addEventListener("click", () => {
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
    let width = uiToggle ? "300px" : "fit-content"
    document.getElementById("levelProperties").style.display = display;
    document.getElementById("tileProperties").style.display = display;
    document.getElementById("brush").style.display = display;
    document.getElementById("level").style.width = width;
    refreshButton.style.display = display;
    submitButton.style.display = display;
}

function refreshDisplay() {
    if (lock) {
        tiles.forEach(e => {
            e.tile.style.background = colors[e.type]
        });
    } else {
        tiles = [];
        levelDisplay.innerHTML = '';

        tileX = parseInt(tileXInput.value);
        tileY = parseInt(tileYInput.value);
        tileSize = parseInt(tileSizeInput.value);
    
        if (Number.isInteger(tileX) && Number.isInteger(tileY) && Number.isInteger(tileSize)) {
            for (let y = 0; y < tileY; y++) {
                let row = document.createElement("div");
                for (let x = 0; x < tileX; x++) {
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
                        connectedId: ""
                    })
                }
                levelDisplay.appendChild(row);
            }
        }
    }
}

function tileClick(tile) {
    if (connectingId) {
        tiles.forEach(e => {
            if (e.tile == tile) {
                selectedTile.connectedId = e.id;
                connectingId = false;
                toggleUi();
                selectedTile.tile.innerHTML = 'o';
                typeInput.value = selectedTile.type;
                idInput.value = selectedTile.id;
                spanRowInput.value = selectedTile.spanRow;
                spanColumnInput.value = selectedTile.spanColumn;
                idConnectInput.value = selectedTile.connectedId;
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
                typeInput.value = currentTile.type;
                idInput.value = currentTile.id;
                spanRowInput.value = currentTile.spanRow;
                spanColumnInput.value = currentTile.spanColumn;
                idConnectInput.value = currentTile.connectedId;
    
                if (type > colors.length - 1 || type == -1) return;   
                currentTile.type = type;
                currentTile.id = currentTile.x + ":" + currentTile.y + ":" + type;
                refreshDisplay();
                return;
            }
        });
    }
}

spanColumnInput.addEventListener("input", () => {
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

function exportToJson() {
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
        });
    }

    // Convert the array to a JSON string
    var jsonString = JSON.stringify(newTiles, null, 2); // The third parameter (2) is for indentation

    // Create a Blob from the JSON string
    var blob = new Blob([jsonString], { type: "application/json" });

    // Create a download link
    var downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "tiles.json"; // Specify the filename

    // Append the link to the document
    document.body.appendChild(downloadLink);

    // Trigger a click on the link to start the download
    downloadLink.click();

    // Remove the link from the document
    document.body.removeChild(downloadLink);
}