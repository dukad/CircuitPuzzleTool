import Cell from 'cell.js';

export default class Wire extends Cell {
    constructor(x_coordinate, y_coordinate, dimension, app, color) {
        super(x_coordinate, y_coordinate, dimension, app, color);
        this.connected_parts = [];
        this.display_directions = [];
    }

    find_direction(part) {
        let x_diff = part.x - this.x;
        let y_diff = part.y - this.y;
        let direction = 0;
        direction += (y_diff + 1)*3;
        direction += (x_diff + 1);
        if (direction !== 4) {
            return direction;
        } else {
            return null;
        }
    }

    reverse_direction(dir) {
        let rem = dir % 3;
        let div = (dir - rem) / 3;
        let rem_reverse = Math.abs(rem - 2);
        let div_reverse = Math.abs(div - 2);
        div_reverse *= 3;
        return (div_reverse + rem_reverse);
    }

    connect(part) {
        this.connected_parts.append(part);
        part.connected_parts.append(this);
        let direction = this.find_direction(part);
        this.display_directions.append(direction)
        part.display_directions.append(this.reverse_direction(direction))
    }

    create_node() {
        this.graphic.lineStyle(2, 0x1f1f1f, 1);
        this.graphic.beginFill(0x04b504);
        this.graphic.drawCircle(this.x + this.dimension/2, this.y + this.dimension/2, this.dimension / 3);
        this.graphic.endFill();
        this.app.stage.addChild(this.graphic);
    }

    render() {
        this.create_node();

    }
}