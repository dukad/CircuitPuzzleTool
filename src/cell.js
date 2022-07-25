// import Wire from './wire.js';

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
        this.connected_parts = new Set();
    }

    connect(part) { //connect two adjacent wires
        this.connected_parts.add(part);
        part.connected_parts.add(this);
        let direction = this.find_direction(part);
        this.display_orient(direction)
        part.display_orient(this.reverse_direction(direction))
    }

    disconnect(part) {
        this.connected_parts.delete(part);
        part.connected_parts.delete(this);
        let direction = this.find_direction(part);
        this.undisplay(direction);
        part.undisplay(this.reverse_direction(direction));
    }

    reverse_direction(dir) { //reverse the direction
        let rem = dir % 3;
        let div = (dir - rem) / 3;
        let rem_reverse = Math.abs(rem - 2);
        let div_reverse = Math.abs(div - 2);
        div_reverse *= 3;
        return (div_reverse + rem_reverse);
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

    draw() {
        this.graphic.lineStyle(2, 0x1f1f1f, 1) // set lines which border cells and become the grid
        this.graphic.beginFill(this.color) //fill with black
        this.graphic.drawRect(this.xpixels, this.ypixels, this.dimension, this.dimension) //create square
        this.graphic.endFill()
        this.app.stage.addChild(this.graphic) //stage this graphic
    }

    onClick() {
        this.makeWire();
    }

    makeWire() {
        let newWire;
        newWire = new Wire(this.x, this.y, this.dimension, this.app, this.color, this.matrix) // new wire object with same properties as the cell
        this.matrix[this.y][this.x] = newWire; // set the matrix coordinates to the new object
        for (let i=-1; i<2; i++) { // iterate through possible directions
            for (let j=-1; j<2; j++) {
                if ((i !== 0) || (j !== 0)) { // don't include the center
                    try {
                        let part = this.matrix[Math.abs(this.y + i)][Math.abs(this.x + j)]
                        if ((part instanceof Wire) || (part instanceof Component)){ //if adjacent objects are a wire
                            newWire.connect(part) // connect this wire with adjacent wires
                            part.render() //render adjacent wires again
                            if (part instanceof Component) {
                                part.refresh();
                            }
                            newWire.render()
                        }
                    } catch(err) {
                        console.log('issue happening in onClick')
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
        this.display_directions = new Set();
    }

    display_orient(direction) {
        this.display_directions.add(direction)
    }

    undisplay(direction) {
        this.display_directions.delete(direction)
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
        this.graphic.lineStyle(5, 0x04b504); // change the linestyle to thick green
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
        console.log(this.connected_parts);
    }
}



export class Component extends Cell {
    constructor(x_coordinate, y_coordinate, dimension, app, color, matrix) {
        super(x_coordinate, y_coordinate, dimension, app, color, matrix);
        this.orientation = null;
    }

    display_orient(direction) {
        this.orientation = direction;
    }

    undisplay(direction) {
        // this.orientation = null;
    }
}

export class Resistor extends Component {
    constructor(x_coordinate, y_coordinate, dimension, app, color, matrix, value) {
        super(x_coordinate, y_coordinate, dimension, app, color, matrix);
        this.value = value;
    }

    render() {
        this.graphic.destroy() // destroy any current lines draw on
        this.graphic = new PIXI.Graphics // recreate the item
        this.app.stage.addChild(this.graphic);
        this.graphic.lineStyle(5, 0x04b504); // change the linestyle to thick green

        //draw a resistor
        let x = this.xpixels;
        let y = this.ypixels + this.dimension/2;
        this.graphic.moveTo(x, y);
        this.graphic.lineTo(x+this.dimension/10, y)
        this.graphic.lineTo(x+this.dimension/5, y - this.dimension/4)
        this.graphic.lineTo(x+this.dimension*2/5, y + this.dimension/4)
        this.graphic.lineTo(x+this.dimension*3/5, y - this.dimension/4)
        this.graphic.lineTo(x+this.dimension*4/5, y + this.dimension/4)
        this.graphic.lineTo(x+this.dimension*9/10, y)
        this.graphic.lineTo(x+this.dimension, y)
        //set pivot point to the middle
        this.graphic.x = this.xpixels + this.dimension/2;
        this.graphic.y = this.ypixels + this.dimension/2;
        this.graphic.pivot.x = this.graphic.x;
        this.graphic.pivot.y = this.graphic.y;
        if(((this.orientation === null) || (this.orientation ===3)) || (this.orientation === 5)) {
            this.graphic.rotation = 0;
        } else if ((this.orientation === 1) || (this.orientation === 7)) {
            this.graphic.rotation = 3.1415/2
        } else if ((this.orientation === 0) || (this.orientation === 8)) {
            this.graphic.rotation = 3.1415/4
            this.graphic.moveTo(x, y);
            this.graphic.lineTo(x - this.dimension/4, y);
            this.graphic.moveTo(x + this.dimension, y);
            this.graphic.lineTo(x + this.dimension * 5/4, y);
        } else if ((this.orientation === 2) || (this.orientation === 6)) {
            this.graphic.rotation = 3.1415 * 3/4;
            this.graphic.moveTo(x, y);
            this.graphic.lineTo(x - this.dimension/4, y);
            this.graphic.moveTo(x + this.dimension, y);
            this.graphic.lineTo(x + this.dimension * 5/4, y);
        }
        this.refresh()
        // console.log(this.connected_parts);
    }

    refresh() {
        for (let i=-1; i<2; i++) { // iterate through possible directions
            for (let j=-1; j<2; j++) {
                if ((i !== 0) || (j !== 0)) { // don't include the center
                    let part = this.matrix[Math.abs(this.y + i)][Math.abs(this.x + j)];
                    if ((part instanceof Wire) || (part instanceof Component)) { //if adjacent objects are a wire
                        let dir = this.find_direction(part)
                        if((dir === this.orientation) || (this.reverse_direction(dir) === this.orientation)) {
                            this.connect(part)
                            console.log('connected in refresh')
                        } else {
                            this.disconnect(part) // connect this wire with adjacent wires
                        }
                        if(part instanceof Wire) {
                            part.render();
                        }
                    }
                }
            }

        }
    }
}