import Cell, {Wire} from 'cell.js';

export default class Component extends Cell {
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