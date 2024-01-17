class Utils {
    static inputStates = {};
    
    static keybindsPlayer1 = {
        jump: "w",
        moveLeft: "a",
        moveRight: "d",
        destroy: "e",
    }
    static keybindsPlayer2 = {
        jump: "ArrowUp",
        moveLeft: "ArrowLeft",
        moveRight: "ArrowRight",
        destroy: "l"
    }
    static mouse = {
        x: 0,
        y: 0
    }
    static player1Color = "#ff4a36";
    static player2Color = "#3421ff";
    static colors = [
        "#00000000",// empty placeholder
        "#ed975c",  //wall
        "#51cf38",  // button
        "#d66b45",  // door
        "red",      //spike
        "#ad6134",  //crate
        "green",    //spawn point (temp)
        "#bd4d31",  // movables
        "#34ebe8",  // checkpoint
        "#32e641"   // finish
    ]
    static stageLayout = [];
    static currentStage;

    static moveTowards(current, target, maxDelta) {
        const difference = target - current;
        if (Math.abs(difference) <= maxDelta) {
            return target;
        } else {
            const direction = difference > 0 ? 1 : -1;
            return current + (direction * maxDelta);
        }
    }

    static raycast(self, origin, direction, length, walls) {
        let intersection = null;
    
        for (let i = 0; i < walls.length; i++) {
            if (self == walls[i]) {
                continue;
            }
            if (
                origin.x < walls[i].position.x + walls[i].width &&
                origin.x + direction.x * length > walls[i].position.x &&
                origin.y < walls[i].position.y + walls[i].height &&
                origin.y + direction.y * length > walls[i].position.y
            ) {
                const t = (walls[i].position.x - origin.x) / direction.x;
                const intersectionY = origin.y + t * direction.y;
    
                intersection = {
                    x: walls[i].position.x,
                    y: intersectionY,
                    wall: walls[i]
                };

                break;
            }
        }
    
        return intersection;
    }
    static getDirection(player, acceleration, friction, keybinds) {
        let targetAcceleration = 0;
    
        if (!(this.inputStates[keybinds.moveLeft] && this.inputStates[keybinds.moveRight])) {
            if (this.inputStates[keybinds.moveLeft]) {
                targetAcceleration = -1;
            } else if (this.inputStates[keybinds.moveRight]) {
                targetAcceleration = 1;
            }
        }
        let direction = this.moveTowards(player.dx, targetAcceleration, Math.sign(player.dx) == targetAcceleration || player.dx == 0 ? acceleration : friction);
        return direction;
    }

    static checkForCollisions(self, offsetHorizontal, offsetVertical) {
        let collisionTopLeftX = { x: self.position.x - offsetHorizontal, y: self.position.y };
        let collisionBottomLeftX = { x: self.position.x - offsetHorizontal, y: self.position.y + self.height };
        
        let collisionTopRightX = { x: self.position.x + self.width + offsetHorizontal, y: self.position.y };
        let collisionBottomRightX = { x: self.position.x + self.width + offsetHorizontal, y: self.position.y + self.height };

        let collisionBottomLeftY = { x: self.position.x + self.width, y: self.position.y + self.height + offsetVertical }
        let collisionBottomRightY = { x: self.position.x, y: self.position.y + self.height + offsetVertical }
                
        let collisionTopLeftY = { x: self.position.x + self.width + offsetHorizontal, y: self.position.y }
        let collisionTopRightY = { x: self.position.x + self.width + offsetHorizontal, y: self.position.y + self.height }

        return {
            left: 
                !!Utils.raycast(self, collisionTopLeftX, { x: 0, y: 1 }, self.height, self.walls) || 
                !!Utils.raycast(self, collisionBottomLeftX, { x: 0, y: -1 }, self.height, self.walls) || 
                !!Utils.raycast(self, collisionTopLeftX, { x: 0, y: 1 }, self.height, self.entities) || 
                !!Utils.raycast(self, collisionBottomLeftX, { x: 0, y: -1 }, self.height, self.entities),

            right: 
                !!Utils.raycast(self, collisionTopRightX, { x: 0, y: 1 }, self.height, self.walls) || 
                !!Utils.raycast(self, collisionBottomRightX, { x: 0, y: -1 }, self.height, self.walls) ||
                !!Utils.raycast(self, collisionTopRightX, { x: 0, y: 1 }, self.height, self.entities) || 
                !!Utils.raycast(self, collisionBottomRightX, { x: 0, y: -1 }, self.height, self.entities),

            bottom: 
                !!Utils.raycast(self, collisionBottomLeftY, { x: -1, y: 0 }, self.width, self.walls) || 
                !!Utils.raycast(self, collisionBottomRightY, { x: 1, y: 0 }, self.width, self.walls) || 
                !!Utils.raycast(self, collisionBottomLeftY, { x: -1, y: 0 }, self.width, self.entities) || 
                !!Utils.raycast(self, collisionBottomRightY, { x: 1, y: 0 }, self.width, self.entities),

            top: 
                !!Utils.raycast(self, collisionTopLeftY, { x: 0, y: 1 }, self.height, self.walls) || 
                !!Utils.raycast(self, collisionTopRightY, { x: 0, y: -1 }, self.height,self.walls) || 
                !!Utils.raycast(self, collisionTopLeftY, { x: 0, y: 1 }, self.height, self.entities) || 
                !!Utils.raycast(self, collisionTopRightY, { x: 0, y: -1 }, self.height,self.entities),
        }

    }

    static getNearby(self, offsetHorizontal) {
        let left = { x: self.position.x - offsetHorizontal, y: self.position.y + self.height / 2 };
        let right = { x: self.position.x + self.width, y: self.position.y + self.height / 2 };
        let rightEntity = Utils.raycast(self, right, { x: 1, y: 0 }, offsetHorizontal, self.entities)
        let leftEntity = Utils.raycast(self, left, { x: 1, y: 0 }, offsetHorizontal, self.entities)
        if (rightEntity && rightEntity.wall instanceof Prop) {
            return rightEntity;
        }
        if (leftEntity && leftEntity.wall instanceof Prop) {
            return leftEntity;
        }
        return null;
    }

    static checkOverlap(self) {
        return !!Utils.raycast(self, {x: self.position.x + 8, y: self.position.y}, {x: 1, y: 0}, self.width - 16, self.walls)
            // !!Utils.raycast(self, {x: self.position.x + self.width - sensitivity, y: self.position.y + sensitivity}, {x: -1, y: 0}, self.width - sensitivity, self.walls)
    }

    static getDistance(point1, point2) {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
    }

    static loadJsonFile(path, fileInput) {
        if (fileInput) {
            return new Promise((resolve, reject) => {
                var file = fileInput.files[0];
                var reader = new FileReader();
                var jsonData;
    
                try {
                    reader.onload = function (e) {
                        jsonData = JSON.parse(e.target.result);
                        resolve(jsonData);
                    };
                    reader.readAsText(file);
                } catch (error) {
                    if (jsonData) resolve(jsonData);
                }
            });
        } else {
            var request = new XMLHttpRequest();
            request.open("GET", path, false);
            request.send();
    
            if (request.status === 200) {
                return JSON.parse(request.responseText);
            } else {
                console.error('Error fetching JSON. Status: ', request.status);
                return null;
            }
        }
    }
    static lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
}

