class Finish extends Checkpoint {
    constructor({x, y, width, height, color}) {
        super({x, y, width, height, color});
        this.finished = false;
    }
    update(context, entities, camera) {
        if (this.getEntitiesInside(entities).length == 2 && !this.finished) {
            this.finished = true;
            setTimeout(() => {
                alert("finished and shit")
            }, 200)
        }
        super.update(context, entities, camera)
    }
}