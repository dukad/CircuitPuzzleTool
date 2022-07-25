import Cell from './cell.js';

export default class Wire extends Cell {
    constructor(x_coordinate, y_coordinate, dimension, app, color, matrix) {
        super(x_coordinate, y_coordinate, dimension, app, color, matrix);
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
