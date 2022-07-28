import Cell from "./cell.js";

export default class Wire extends Cell {
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
