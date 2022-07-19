export class Cell {
    constructor(x_coordinate, y_coordinate, dimension) {
        this.x = x_coordinate;
        this.y = y_coordinate;
        this.dimension = dimension;
    }

    draw(color, app) {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(color);
        graphics.drawRect(this.x, this.y, this.dimension, this.dimension);
        graphics.endFill();
        app.stage.addChild(graphics);
    };
}