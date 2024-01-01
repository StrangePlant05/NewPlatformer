class Utils {
    static inputStates = {};
    static mouse = {
        x: undefined,
        y: undefined
    }
    static entities = [];

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
    
        for (const wall of walls) {
            if (self == wall) {
                break;
            }
            if (
                origin.x < wall.position.x + wall.width &&
                origin.x + direction.x * length > wall.position.x &&
                origin.y < wall.position.y + wall.height &&
                origin.y + direction.y * length > wall.position.y
            ) {
                const t = (wall.position.x - origin.x) / direction.x;
                const intersectionY = origin.y + t * direction.y;
    
                intersection = {
                    x: wall.position.x,
                    y: intersectionY,
                    wall: wall
                };

                break;
            }
        }
    
        return intersection;
    }
    
    static getDirection(player, acceleration) {
        let direction = this.inputStates["a"] && this.inputStates ["d"] ? 
        this.moveTowards(player.dx, 0, 0.1) : 
        this.moveTowards(player.dx, this.inputStates["a"] ?
            -1 : this.inputStates["d"] ? 
            1 : 0,
        acceleration);
        return direction;
    }
}