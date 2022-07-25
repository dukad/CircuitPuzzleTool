import Cell from 'cell.js';

export class Component extends Cell {
    constructor(x_coordinate, y_coordinate, dimension, app, color, matrix) {
        super(x_coordinate, y_coordinate, dimension, app, color, matrix);
        this.orientation = null;
    }

    display_orient(direction) {
        this.orientation = direction;
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
        this.graphic.lineStyle(10, 0x04b504); // change the linestyle to thick green
        if((this.orientation === null) || (this.orientation ===3) || (this.orientation === 5)) {
            this.graphic.moveTo(this.x, this.y + this.dimension/2)
            this.graphic.lineTo(this.x + this.dimension, this.y + this.dimension/2)
        }

        this.app.stage.addChild(this.graphic);

        // console.log(this.x, this.y, this.display_directions, this.connected_parts.size)
    }
}