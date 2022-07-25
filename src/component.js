import Cell, {Wire} from 'cell.js';

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


export class VoltageSource extends Component {
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

        } else if ((this.orientation === 2) || (this.orientation === 6)) {
            this.graphic.rotation = 3.1415 * 3/4;

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