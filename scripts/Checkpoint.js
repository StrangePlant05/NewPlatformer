class Checkpoint extends TriggerBox {
    constructor({id, x, y, width, height, color}) {
        super({x, y, width, height, color});
        this.id = id;
    }
    update(context, entities, camera) {
        this.getEntitiesInside(entities).forEach(player => {
            if (!player.visitedCheckpoints.filter(checkpoints => {return checkpoints == this.id}).length > 0) {
                player.respawn = {
                    x: (this.position.x + (this.width / 2)) - (player.width / 2),
                    y: this.position.y
                };
                player.visitedCheckpoints.push(this.id);
            }
        });
        super.update(context, entities, camera)
    }

    getEntitiesInside(entities) {
        return entities.filter(entity => this.isEntityInside(entity) && entity instanceof Player);
    }
}