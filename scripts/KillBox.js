class KillBox extends TriggerBox {
    constructor({x, y, width, height, color}) {
        super({x, y, width, height, color});
    }

    update(context, entities, camera) {
        super.update(context, entities, camera)
    }

    getEntitiesInside(entities) {
        return entities.filter(entity => this.isEntityInside(entity) && entity instanceof Player);
    }
}