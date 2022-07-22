export default class Cell {
    constructor(x_coordinate, y_coordinate, dimension, app, color) {
        this.graphic = new PIXI.Graphics;
        this.app = app;
        this.x = x_coordinate;
        this.y = y_coordinate;
        this.dimension = dimension;
        this.color = color;
        this.graphic.interactive = true;
        this.graphic.buttonMode = true;
        this.graphic.on('pointerdown', () => this.onClick())
    }

    draw() {
        this.graphic.lineStyle(2, 0x1f1f1f, 1)
        this.graphic.beginFill(this.color)
        this.graphic.drawRect(this.x, this.y, this.dimension, this.dimension)
        this.graphic.endFill()
        this.app.stage.addChild(this.graphic)
    }

    onClick() {
        this.graphic.lineStyle(2, 0x1f1f1f, 1);
        this.graphic.beginFill(0x04b504);
        this.graphic.drawCircle(this.x + this.dimension/2, this.y + this.dimension/2, this.dimension / 3);
        this.graphic.endFill();
        this.app.stage.addChild(this.graphic);
    }


}
