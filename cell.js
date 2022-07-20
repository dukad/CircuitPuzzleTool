export class Cell {
    constructor(x_coordinate, y_coordinate, dimension) {
        this.x = x_coordinate;
        this.y = y_coordinate;
        this.dimension = dimension;
    }

    draw(color, app, graphics) {
        graphic.lineStyle(2, 0x646464, 1)
        graphics.beginFill(color)
        graphics.drawRect(this.x, this.y, this.dimension, this.dimension)
        graphics.endFill()
        app.stage.addChild(graphics)
    }
}
