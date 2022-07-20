export default class Cell {
    constructor(x_coordinate, y_coordinate, dimension, rect, color) {
        this.x = x_coordinate;
        this.y = y_coordinate;
        this.dimension = dimension;
        this.rect = rect;
        this.color = color;

    }

    draw(app, graphics) {
        graphics.lineStyle(2, 0x1f1f1f, 1)
        graphics.beginFill(this.color)
        graphics.drawRect(this.x, this.y, this.dimension, this.dimension)
        graphics.endFill()
        app.stage.addChild(graphics)
    }

    onClick(app, graphics) {
        this.color = 0x04b504
        return this.draw(app, graphics)
    }
}
