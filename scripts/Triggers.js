class TriggerBox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    isEntityInside(entity) {
        const entityX = entity.position.x;
        const entityY = entity.position.y;
        const entityWidth = entity.width;
        const entityHeight = entity.height;

        const insideX = (entityX >= this.x && entityX <= this.x + this.width) ||
            (entityX + entityWidth >= this.x && entityX + entityWidth <= this.x + this.width);

        const insideY = (entityY >= this.y && entityY <= this.y + this.height) ||
            (entityY + entityHeight >= this.y && entityY + entityHeight <= this.y + this.height);

        return insideX && insideY;
    }

    getEntitiesInside(entities) {
        return entities.filter(entity => this.isEntityInside(entity));
    }
}