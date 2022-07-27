// import Wire from './wire.js';

export default class Cell {
    constructor(x_coordinate, y_coordinate, dimension, app, matrix) {
        this.graphic = new PIXI.Graphics; //Container for the graphics of each cell
        this.drawingGraphic = new PIXI.Graphics;
        this.app = app; //pixi application
        this.x = x_coordinate; //index coordinates of the cell
        this.y = y_coordinate;
        this.dimension = dimension; // size of the cell
        this.graphic.interactive = true; // make a button
        this.graphic.buttonMode = true;
        this.graphic.on('mousedown', () => this.onClick()) //run the onClick method when clicked
        this.graphic.on('rightdown', () => this.onRightClick());
        this.xpixels = this.x * this.dimension; // pixel coordinates of the cell
        this.ypixels = this.y * this.dimension;
        this.matrix = matrix; //external matrix of the cell
        this.connected_parts = new Set();
    }

    connect(part) { //connect two adjacent wires
        /**
         * connect two wires both in the graph and visually
         */
        //add to graph
        this.connected_parts.add(part);
        part.connected_parts.add(this);
        //display in the correct direction
        let direction = this.find_direction(part);
        this.display_orient(direction)
        part.display_orient(this.reverse_direction(direction))

    }

    display_orient(direction) {
        //this function does nothing unless overridden by a subclass
    }

    disconnect(part) {
        /**
         * disconnects two parts from each other
         * @param {Wire, Component} part connected part meant to be disconnected
         */
        this.connected_parts.delete(part);
        part.connected_parts.delete(this);
        let direction = this.find_direction(part);
        this.undisplay(direction);
        part.undisplay(this.reverse_direction(direction));
    }

    undisplay(direction) {
        /**
         * this function is designed to be overridden, the opposite of the display_orient method
         * @param {number} direction integer 0-8 corresponding to directions
         */
        alert('Called \' undisplay \' method on an empty cell')
    }

    reverse_direction(dir) {
        /**
         * finds the reversed direction of the input given
         * @type {number}
         */
        let rem = dir % 3;
        let div = (dir - rem) / 3;
        let rem_reverse = Math.abs(rem - 2);
        let div_reverse = Math.abs(div - 2);
        div_reverse *= 3;
        return (div_reverse + rem_reverse);
    }

    find_direction(part) {
        /**
         * returns the direction
         * @type {Wire, Component}
         */
        let x_diff = part.x - this.x; //find the direction which the cell is in
        let y_diff = part.y - this.y;
        let direction = 0; // initialize as top-left
        direction += (y_diff + 1)*3;
        direction += (x_diff + 1);
        if (((direction !== 4) && (direction >= 0)) && (direction <= 8)) { //if the direction is not in the center
            return direction;
        } else {
            return null;
        }
    }

    draw() {
        /**
         * draws the cell that backgrounds the components
         */
        this.graphic.clear() // destroy any current lines draw on
        this.graphic.lineStyle(2, 0x1f1f1f, 1) // set lines which border cells and become the grid
        this.graphic.beginFill(0x000000) //fill with black
        this.graphic.drawRect(this.xpixels, this.ypixels, this.dimension, this.dimension) //create square
        this.graphic.endFill()
        this.app.stage.addChild(this.graphic) //stage this graphic
        // console.log('drawing', this.x, this.y)
    }

    onClick() {
        /**
         * onClick method for all cells, wires, and components
         */

        if (this instanceof Wire) {
            this.makePart('Resistor');
            console.log('hey there')
        } else if (this instanceof Resistor) {
            this.makePart('VoltageSource');
        } else {
            this.makePart('Wire');
        }
        // console.log('onClick running')
    }

    onRightClick() {
        /**
         * onClick method for all cells, wires, and components
         */
        if(this instanceof Resistor) {
            this.makePart('VoltageSource');
        } else {
            this.makePart('Resistor')
        }
        // console.log('onClick running')
    }

    rerender() {
        /**
         * rerender surrounding parts ensuring everything is up to date
         */
        for (let i=-1; i<2; i++) { // iterate through possible directions
            for (let j=-1; j<2; j++) {
                if ((i !== 0) || (j !== 0)) { // don't include the center
                    let part = this.matrix[Math.abs(this.y + i)][Math.abs(this.x + j)];
                    if ((part instanceof Wire) || (part instanceof Component)) { //if adjacent objects are a wire
                        part.render()
                        }
                    }
                }
            }

        }


    makePart(part) {
        /**
         * forms a new part in place of whatever was currently present
         */
        if ((this instanceof Wire) || (this instanceof Component)) {
            this.drawingGraphic.clear()
        }

        let newPart;
        if(part === 'Wire') {
            newPart = new Wire(this.x, this.y, this.dimension, this.app, this.matrix); // new wire object with same properties as the cell
        }
        else if(part === 'Resistor') {
            newPart = new Resistor(this.x, this.y, this.dimension, this.app, this.matrix, 15);
        }
        else if(part === 'VoltageSource') {
            newPart = new VoltageSource(this.x, this.y, this.dimension, this.app, this.matrix, 15);
        }
        else {
            alert('Input non valid circuit part')
        }
        this.matrix[this.y][this.x] = newPart; // set the matrix coordinates to the new object
        // newPart.draw()

        // iterate through possible directions
        for (let i=-1; i<2; i++) {
            for (let j=-1; j<2; j++) {
                if ((i !== 0) || (j !== 0)) { // don't include the center
                    try {
                        let part = this.matrix[Math.abs(this.y + i)][Math.abs(this.x + j)]
                        if ((part instanceof Wire) || (part instanceof Component)){ //if adjacent objects are a wire
                            newPart.connect(part) // connect this wire with adjacent wires
                            part.render() //render adjacent wires again
                            if (part instanceof Component) {
                                part.refresh();
                            }
                            // newPart.render()
                        }
                    } catch(err) {
                        console.log('issue happening in onClick')
                    }
                }
            }
        }
        newPart.draw()
        newPart.render(); //draw wire
        newPart.rerender();

        delete this // delete the original cell object
    }
}


export class Wire extends Cell {
    /**
     * Circuit Wires
     * @param x_coordinate position in matrix
     * @param y_coordinate
     * @param dimension pixel dimension of the cell
     * @param app PIXI application
     * @param matrix matrix holding the cell
     */
    constructor(x_coordinate, y_coordinate, dimension, app, matrix) {
        super(x_coordinate, y_coordinate, dimension, app, matrix);
        this.display_directions = new Set();
    }

    display_orient(direction) {
        /**
         * adds direction to the set of directions needed to display
         * @type {number}
         */
        this.display_directions.add(direction)
    }

    undisplay(direction) {
        /**
         * removes a direction from the display
         * @type {number}
         */
        this.display_directions.delete(direction)
    }

    create_node(size) {
        /**
         * draw a circle of different sizes in the middle of a cell
         * @param {number} size in pixels
         */
        this.drawingGraphic.beginFill(0x04b504);
        this.drawingGraphic.drawCircle(this.xpixels + this.dimension/2, this.ypixels + this.dimension/2, size);
        this.drawingGraphic.endFill();
        this.app.stage.addChild(this.drawingGraphic);
    }

    render() {
        /**
         * recreate the way the object looks on screen
         */
        this.drawingGraphic.clear()
        // this.graphic = new PIXI.Graphics // recreate the item
        if ((this.display_directions.size !== 2)) { //if you want to see a big circle
            this.create_node(this.dimension / 4); // create a big node
        } else {
            this.create_node(this.dimension / 9); //create a small node
        }
        this.draw_a_wire();
        // console.log(this.x, this.y, this.display_directions, this.connected_parts.size)
        console.log(this.connected_parts);
    }

    draw_a_wire() {
        /**
         * actually draw a wire
         */
        // this.graphic.lineStyle.re
        // this.drawingGraphic.clear()
        this.drawingGraphic.lineStyle(5, 0x04b504, 2); // change the linestyle to thick green
        this.display_directions.forEach(i => {
            let dir = i;
            let x_change = dir % 3; // 0, 1, 2
            let y_change = (dir - x_change) / 3; //0, 1, 2
            let x_location = this.xpixels + this.dimension / 2; //center on the cell
            let y_location = this.ypixels + this.dimension / 2;
            this.drawingGraphic.moveTo(x_location, y_location); // move to center of cell
            x_change = (((x_change * this.dimension)) - (this.dimension))/2;
            y_change = (((y_change * this.dimension)) - (this.dimension))/2;
            this.drawingGraphic.lineTo(x_location + x_change, y_location + y_change);
            this.app.stage.addChild(this.drawingGraphic);
        });
    }
}



export class Component extends Cell {
    /**
     * Component subclass of cell containing subclasses for resistors, voltage sources etc.
     * @param x_coordinate
     * @param y_coordinate
     * @param dimension
     * @param app
     * @param matrix
     */
    constructor(x_coordinate, y_coordinate, dimension, app, matrix) {
        super(x_coordinate, y_coordinate, dimension, app, matrix);
        this.orientation = null;
    }

    display_orient(direction) {
        /**
         * change the orientation to a direction
         */
        this.orientation = direction;
    }

    undisplay(direction) {
        /**
         * not needed for components
         */
    }

    rotate() {
        /**
         * rotate the graphic depending on orientation
         */
        //set pivot point to the middle
        this.drawingGraphic.x = this.xpixels + this.dimension / 2;
        this.drawingGraphic.y = this.ypixels + this.dimension / 2;
        this.drawingGraphic.pivot.x = this.drawingGraphic.x;
        this.drawingGraphic.pivot.y = this.drawingGraphic.y;
        if (((this.orientation === null) || (this.orientation === 3)) || (this.orientation === 5)) {
            this.drawingGraphic.rotation = 0;
        } else if ((this.orientation === 1) || (this.orientation === 7)) {
            this.drawingGraphic.rotation = -3.1415 / 2
        } else if ((this.orientation === 0) || (this.orientation === 8)) {
            this.drawingGraphic.rotation = 5 * 3.1415 / 4
        } else if ((this.orientation === 2) || (this.orientation === 6)) {
            this.drawingGraphic.rotation = 5 * 3.1415 * 3 / 4;
        }
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

export class Resistor extends Component {
    /**
     * Resistor component
     * @param x_coordinate
     * @param y_coordinate
     * @param dimension
     * @param app
     * @param matrix
     * @param value
     */
    constructor(x_coordinate, y_coordinate, dimension, app, matrix, value) {
        super(x_coordinate, y_coordinate, dimension, app, matrix);
        this.value = value;
    }

    render() {
        /**
         * render method for resistor!
         */
        // this.graphic.clear() // destroy any current lines draw on
        // this.graphic = new PIXI.Graphics // recreate the item
        this.drawingGraphic.clear()
        this.app.stage.addChild(this.drawingGraphic);
        this.drawingGraphic.lineStyle(5, 0x04b504); // change the linestyle to thick green

        this.draw_a_resistor()
        this.rotate()
        this.refresh()
        // console.log(this.connected_parts);
    }

    draw_a_resistor() {
        /**
         * Creates the PIXI graphic for a resistor
         */
        let x = this.xpixels;
        let y = this.ypixels + this.dimension/2;
        this.drawingGraphic.moveTo(x, y);
        this.drawingGraphic.lineTo(x+this.dimension/10, y)
        this.drawingGraphic.lineTo(x+this.dimension/5, y - this.dimension/4)
        this.drawingGraphic.lineTo(x+this.dimension*2/5, y + this.dimension/4)
        this.drawingGraphic.lineTo(x+this.dimension*3/5, y - this.dimension/4)
        this.drawingGraphic.lineTo(x+this.dimension*4/5, y + this.dimension/4)
        this.drawingGraphic.lineTo(x+this.dimension*9/10, y)
        this.drawingGraphic.lineTo(x+this.dimension, y)

        if ((this.orientation === 0) || (this.orientation === 8)) {
            this.drawingGraphic.moveTo(x, y);
            this.drawingGraphic.lineTo(x - this.dimension / 4, y);
            this.drawingGraphic.moveTo(x + this.dimension, y);
            this.drawingGraphic.lineTo(x + this.dimension * 5 / 4, y);
        } else if ((this.orientation === 2) || (this.orientation === 6)) {
            this.drawingGraphic.moveTo(x, y);
            this.drawingGraphic.lineTo(x - this.dimension / 4, y);
            this.drawingGraphic.moveTo(x + this.dimension, y);
            this.drawingGraphic.lineTo(x + this.dimension * 5 / 4, y);
        }
    }

}


export class VoltageSource extends Component {
    /**
     * Voltage Source Component
     * @param x_coordinate
     * @param y_coordinate
     * @param dimension
     * @param app
     * @param matrix
     * @param value
     */
    constructor(x_coordinate, y_coordinate, dimension, app, matrix, value) {
        super(x_coordinate, y_coordinate, dimension, app, matrix);
        this.value = value;
    }

    render() {
        /**
         * delete old graphic and draw a new voltage source in correct orientation
         */
        // this.graphic.destroy() // destroy any current lines draw on
        // this.graphic = new PIXI.Graphics // recreate the item
        this.drawingGraphic.clear()
        this.app.stage.addChild(this.drawingGraphic);
        this.drawingGraphic.lineStyle(5, 0x04b504); // change the linestyle to thick green

        this.draw_a_voltagesource();
        this.rotate()

        this.refresh()
        // console.log(this.connected_parts);
    }

    draw_a_voltagesource() {
        /**
         * PIXI drawing of voltage source
         */
        let x = this.xpixels;
        let y = this.ypixels + this.dimension / 2;
        this.drawingGraphic.moveTo(x, y);
        this.drawingGraphic.lineTo(x + this.dimension / 6, y)
        this.drawingGraphic.moveTo(x + this.dimension * 5 / 6, y)
        this.drawingGraphic.lineTo(x + this.dimension, y)
        this.drawingGraphic.drawCircle(x + this.dimension / 2, y, this.dimension / (3))

        this.drawingGraphic.lineStyle(2, 0x04b504)
        //draw plus sign
        this.drawingGraphic.moveTo(x + this.dimension * 6 / 12, y)
        this.drawingGraphic.lineTo(x + this.dimension * 8 / 12, y)
        this.drawingGraphic.moveTo(x + this.dimension * 7 / 12, y - this.dimension * 1 / 12)
        this.drawingGraphic.lineTo(x + this.dimension * 7 / 12, y + this.dimension * 1 / 12)
        //draw minus sign
        this.drawingGraphic.moveTo(x + this.dimension * 5 / 12, y - this.dimension * 1 / 12)
        this.drawingGraphic.lineTo(x + this.dimension * 5 / 12, y + this.dimension * 1 / 12)

        this.drawingGraphic.lineStyle(5, 0x04b504);

        if ((this.orientation === 0) || (this.orientation === 8)) {
            this.drawingGraphic.moveTo(x, y);
            this.drawingGraphic.lineTo(x - this.dimension / 4, y);
            this.drawingGraphic.moveTo(x + this.dimension, y);
            this.drawingGraphic.lineTo(x + this.dimension * 5 / 4, y);
        } else if ((this.orientation === 2) || (this.orientation === 6)) {
            this.drawingGraphic.moveTo(x, y);
            this.drawingGraphic.lineTo(x - this.dimension / 4, y);
            this.drawingGraphic.moveTo(x + this.dimension, y);
            this.drawingGraphic.lineTo(x + this.dimension * 5 / 4, y);
        }
    }
}