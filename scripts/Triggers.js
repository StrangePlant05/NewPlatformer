class TriggerBox extends Sprite{
    constructor({id, x, y, width, height, color}) {
        super({x, y, width, height, color})
        this.isTouching = false;
        this.id = id;
    }

    isEntityInside(entity) {
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
        this.isTouching = this.getEntitiesInside(entities).length > 0;
        this.draw(context, camera);
    }
}