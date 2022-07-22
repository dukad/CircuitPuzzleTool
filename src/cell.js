// import Wire from 'src/wire.js';

export default class Cell {
    constructor(x_coordinate, y_coordinate, dimension, app, color, matrix) {
        this.graphic = new PIXI.Graphics;
        this.app = app;
        this.x = x_coordinate;
        this.y = y_coordinate;
        this.dimension = dimension;
        this.color = color;
        this.graphic.interactive = true;
        this.graphic.buttonMode = true;
        this.graphic.on('pointerdown', () => this.onClick())
        this.xpixels = this.x * this.dimension;
        this.ypixels = this.y * this.dimension;
        this.matrix = matrix;
    }

    draw() {
        this.graphic.lineStyle(2, 0x1f1f1f, 1)
        this.graphic.beginFill(this.color)
        this.graphic.drawRect(this.xpixels, this.ypixels, this.dimension, this.dimension)
        this.graphic.endFill()
        this.app.stage.addChild(this.graphic)
    }

    onClick() {
        let newWire;
        newWire = new Wire(this.x, this.y, this.dimension, this.app, this.color, this.matrix)
        this.matrix[this.x][this.y] = newWire;
        for (let i=-1; i<2; i++) {
            for (let j=-1; j<2; j++) {
                if ((i !== 0) || (j !== 0)) {
                    if (this.matrix[this.x + i][this.y + j] instanceof Wire) {
                        newWire.connect(this.matrix[this.x + i][this.y + j])
                        this.matrix[this.x + i][this.y + j].render()
                    }
                }
            }
        }
        newWire.render();
    }
}


export class Wire extends Cell {
    constructor(x_coordinate, y_coordinate, dimension, app, color, matrix) {
        super(x_coordinate, y_coordinate, dimension, app, color, matrix);
        this.connected_parts = new Set();
        this.display_directions = new Set();
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
        this.connected_parts.add(part);
        part.connected_parts.add(this);
        let direction = this.find_direction(part);
        this.display_directions.add(direction)
        part.display_directions.add(this.reverse_direction(direction))
    }

    create_node(size) {
        this.graphic.lineStyle(2, 0x04b504, 1);
        this.graphic.beginFill(0x04b504);
        this.graphic.drawCircle(this.xpixels + this.dimension/2, this.ypixels + this.dimension/2, this.dimension / size);
        this.graphic.endFill();
        this.app.stage.addChild(this.graphic);
    }

    render() {
        this.graphic.destroy()
        this.graphic = new PIXI.Graphics
        if ((this.display_directions.size !== 2)) {
            this.create_node(3);
        } else {
            this.create_node(12)
        }
        this.graphic.lineStyle(10, 0x04b504, 1);
        this.display_directions.forEach(i => {
            let dir = i;
            let x_change = dir % 3; // 0, 1, 2
            let y_change = (dir - x_change) / 3; //0, 1, 2
            let xlocation = this.xpixels + this.dimension / 2;
            let ylocation = this.ypixels + this.dimension / 2;
            this.graphic.moveTo(xlocation, ylocation) // move to center of cell
            x_change = (((x_change * this.dimension)) - (this.dimension))/2
            y_change = (((y_change * this.dimension)) - (this.dimension))/2
            this.graphic.lineTo(xlocation + x_change, ylocation + y_change)
            this.app.stage.addChild(this.graphic)
        });
        console.log(this.x, this.y, this.display_directions, this.connected_parts.size)
    }
}