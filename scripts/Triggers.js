class TriggerBox extends Sprite{
    constructor({id, x, y, width, height, color}) {
        super({x, y, width, height, color})
        this.isPressed = false;
        this.id = id;
    }

    isEntityInside(entity) {
        // const entityX = entity.position.x;
        // const entityY = entity.position.y;
        // const entityWidth = entity.width;
        // const entityHeight = entity.height;

        // const insideX = (entityX >= this.x && entityX <= this.x + this.width) ||
        //     (entityX + entityWidth >= this.x && entityX + entityWidth <= this.x + this.width);

        // const insideY = (entityY >= this.y && entityY <= this.y + this.height) ||
        //     (entityY + entityHeight >= this.y && entityY + entityHeight <= this.y + this.height);

        // return insideX && insideY;

        const entityX = entity.position.x;
        const entityY = entity.position.y;
        const entityWidth = entity.width;
        const entityHeight = entity.height;

        const overlapsX = entityX < this.position.x + this.width && entityX + entityWidth > this.position.x;
        const overlapsY = entityY < this.position.y + this.height && entityY + entityHeight > this.position.y;

        return overlapsX && overlapsY;
    }

    getEntitiesInside(entities) {
        return entities.filter(entity => this.isEntityInside(entity));
    }

    update(context, entities, camera) {
        this.isPressed = this.getEntitiesInside(entities).length > 0;
        this.draw(context, camera);
    }
}