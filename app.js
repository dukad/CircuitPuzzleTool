import Cell from './src/cell.js';
// create a new pixi application, all things inside the application must fit within this window
const app = new PIXI.Application(
    {
        width: window.outerWidth,
        height: window.outerHeight,
        backgroundColor: 0x11111,
        resolution: window.devicePixelRatio || 1,
    }
)

// tell the html document to display the pixi application
document.body.appendChild(app.view)

// Cell class meant to be in cell.js after import problems fixed
// class Cell {
//     constructor(x_coordinate, y_coordinate, dimension, rect) {
//         this.x = x_coordinate;
//         this.y = y_coordinate;
//         this.dimension = dimension;
//         this.rect = rect;
//
//     }
//
//     draw(color, app, graphics) {
//         graphics.lineStyle(2, 0x646464, 1)
//         graphics.beginFill(color)
//         graphics.drawRect(this.x, this.y, this.dimension, this.dimension)
//         graphics.endFill()
//         app.stage.addChild(graphics)
//     }
// }

// create container for all cells
let graphic = new PIXI.Graphics();
app.stage.addChild(graphic);

// constants
const cell_dimension = 45
const grid_height = window.innerHeight / cell_dimension
const grid_width = window.innerWidth / cell_dimension
let cell = [];

//create a matrix of cells
for (let i = 0; i < grid_height; i++) {
    for (let j = 0; j < grid_width; j++)
    {
        let rect;
        rect = new PIXI.Rectangle(i * 45, j * 45, cell_dimension, cell_dimension);
        cell[i][j] = new Cell(i * 45, j * 45, cell_dimension, rect)
        cell.draw(0x000000, app, graphic)
    }
}


