//import Wire from './wire.js';

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

export class Wire extends Cell {
    constructor(x_coordinate, y_coordinate, dimension, app, color, matrix) {
        super(x_coordinate, y_coordinate, dimension, app, color, matrix);
        this.connected_parts = new Set(); //empty sets!
        this.display_directions = new Set();
    }

    find_direction(part) {
        let x_diff = part.x - this.x; //find the direction which the cell is in
        let y_diff = part.y - this.y;
        let direction = 0; // initialize as top-left
        direction += (y_diff + 1)*3;
        direction += (x_diff + 1);
        if (direction !== 4) { //if the direction is not in the center
            return direction;
        } else {
            return null;
        }
    }

    reverse_direction(dir) { //reverse the direction
        let rem = dir % 3;
        let div = (dir - rem) / 3;
        let rem_reverse = Math.abs(rem - 2);
        let div_reverse = Math.abs(div - 2);
        div_reverse *= 3;
        return (div_reverse + rem_reverse);
    }

    connect(part) { //connect two adjacent wires
        this.connected_parts.add(part);
        part.connected_parts.add(this);
        let direction = this.find_direction(part);
        this.display_directions.add(direction)
        part.display_directions.add(this.reverse_direction(direction))
    }

    create_node(size) { //draw a circle of varying size
        // this.graphic.lineStyle(0, 0x04b504, 1);
        this.graphic.beginFill(0x04b504);
        this.graphic.drawCircle(this.xpixels + this.dimension/2, this.ypixels + this.dimension/2, size);
        this.graphic.endFill();
        this.app.stage.addChild(this.graphic);
    }

    render() {
        this.graphic.destroy() // destroy any current lines draw on
        this.graphic = new PIXI.Graphics // recreate the item
        if ((this.display_directions.size !== 2)) { //if you want to see a big circle
            this.create_node(this.dimension / 4); // create a big node
        } else {
            this.create_node(this.dimension / 9) //create a small node
        }
        this.graphic.lineStyle(10, 0x04b504); // change the linestyle to thick green
        this.display_directions.forEach(i => {
            let dir = i;
            let x_change = dir % 3; // 0, 1, 2
            let y_change = (dir - x_change) / 3; //0, 1, 2
            let x_location = this.xpixels + this.dimension / 2; //center on the cell
            let y_location = this.ypixels + this.dimension / 2;
            this.graphic.moveTo(x_location, y_location); // move to center of cell
            x_change = (((x_change * this.dimension)) - (this.dimension))/2;
            y_change = (((y_change * this.dimension)) - (this.dimension))/2;
            this.graphic.lineTo(x_location + x_change, y_location + y_change);
            this.app.stage.addChild(this.graphic);
        });
        // console.log(this.x, this.y, this.display_directions, this.connected_parts.size)
    }
}
