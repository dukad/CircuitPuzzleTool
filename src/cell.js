import Wire from '/wire.js';

export default class Cell {
    constructor(x_coordinate, y_coordinate, dimension, app, color, matrix) {
        this.graphic = new PIXI.Graphics; //Container for the graphics of each cell
        this.app = app; //pixi application
        this.x = x_coordinate; //index coordinates of the cell
        this.y = y_coordinate;
        this.dimension = dimension; // size of the cell
        this.color = color; // color of the background of the cell
        this.graphic.interactive = true; // make a button
        this.graphic.buttonMode = true;
        this.graphic.on('pointerdown', () => this.onClick()) //run the onClick method when clicked
        this.xpixels = this.x * this.dimension; // pixel coordinates of the cell
        this.ypixels = this.y * this.dimension;
        this.matrix = matrix; //external matrix of the cell
    }

    draw() {
        this.graphic.lineStyle(2, 0x1f1f1f, 1) // set lines which border cells and become the grid
        this.graphic.beginFill(this.color) //fill with black
        this.graphic.drawRect(this.xpixels, this.ypixels, this.dimension, this.dimension) //create square
        this.graphic.endFill()
        this.app.stage.addChild(this.graphic) //stage this graphic
    }

    onClick() {
        let newWire;
        newWire = new Wire(this.x, this.y, this.dimension, this.app, this.color, this.matrix) // new wire object with same properties as the cell
        this.matrix[this.y][this.x] = newWire; // set the matrix coordinates to the new object
        for (let i=-1; i<2; i++) { // iterate through possible directions
            for (let j=-1; j<2; j++) {
                if ((i !== 0) || (j !== 0)) { // don't include the center
                    try {
                        if (this.matrix[Math.abs(this.y + i)][Math.abs(this.x + j)] instanceof Wire) { //if adjacent objects are a wire
                            newWire.connect(this.matrix[this.y + i][this.x + j]) // connect this wire with adjacent wires
                            this.matrix[this.y + i][this.x + j].render() //render adjacent wires again
                        }
                    } catch(err) {
                        console.log('hey there, this is bad code design, fix this part please')
                    }
                }
            }
        }
        delete this // delete the original cell object
        newWire.draw(); //draw background
        newWire.render(); //draw wire
    }
}
