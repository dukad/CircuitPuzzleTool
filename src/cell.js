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

    onClick(app, graphics2) {
        {
            graphics2.lineStyle(2, 0x1f1f1f, 1);
            graphics2.beginFill(0x04b504);
            graphics2.drawCircle(cell_dimension/2, cell_dimension/2, cell_dimension / 3);
            graphics2.endFill();
            app.stage.addChild(graphics2);
        }
    }

}
