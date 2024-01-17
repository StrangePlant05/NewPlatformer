class Finish extends Checkpoint {
    constructor({stage, x, y, width, height, color}) {
        super({x, y, width, height, color});
        this.finished = false;
        this.stage = stage;
    }
    update(context, entities, camera) {
        if (this.getEntitiesInside(entities).length == 2 && !this.finished) {
            this.finished = true;
            setTimeout(() => {
                this.stage.finishStage();
            }, 200)
        }
        super.update(context, entities, camera)
    }
    setCheckpoint(entities) {
        let touchingPlayers = this.getEntitiesInside(entities);
        if (touchingPlayers.length == 0) {
            this.color = this.originalColor;
        }
        touchingPlayers.forEach(player => {
            player.respawn = {
                x: (this.position.x + (this.width / 2)) - (player.width / 2),
                y: this.position.y
            };
            player.currentCheckpoint = this;
            if (this.activePlayers.filter(oldPlayer => {return oldPlayer == player}).length == 0) this.activePlayers.push(player);
            if (touchingPlayers.length == 1) {
                this.color = "#139e25";
            }
            if (touchingPlayers.length == 2) {
                this.color = "#0d781b";
            }
        });
    }
}