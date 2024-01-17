class Checkpoint extends TriggerBox {
    constructor({id, x, y, width, height, color}) {
        super({x, y, width, height, color});
        this.id = id;
        this.activePlayers = [];
        this.originalColor = color;
    }
    update(context, entities, camera) {
        if (this.activePlayers[0]) {
            if (this.activePlayers[0].currentCheckpoint !== this) this.activePlayers.splice(0, 1);
        }
        if (this.activePlayers[1]) {
            if (this.activePlayers[1].currentCheckpoint !== this)  this.activePlayers.splice(1, 1);
        }
        this.setCheckpoint(entities);
        super.update(context, entities, camera)
    }

    getEntitiesInside(entities) {
        return entities.filter(entity => this.isEntityInside(entity) && entity instanceof Player);
    }

    setCheckpoint(entities) {
        if (this.activePlayers.length == 0) {
            this.color = this.originalColor
        }
        this.getEntitiesInside(entities).forEach(player => {
            player.respawn = {
                x: (this.position.x + (this.width / 2)) - (player.width / 2),
                y: this.position.y
            };
            player.currentCheckpoint = this;
            if (this.activePlayers.filter(oldPlayer => {return oldPlayer == player}).length == 0) this.activePlayers.push(player)
        });
        if (this.activePlayers.length == 1) {
            if (this.activePlayers[0].color == Utils.player1Color) {
                this.color = "#ab2213";
            } else if (this.activePlayers[0].color == Utils.player2Color){
                this.color = "#1a0e9e";
            }
        }
        if (this.activePlayers.length == 2) {
            this.color = "purple";
        }
    }
}