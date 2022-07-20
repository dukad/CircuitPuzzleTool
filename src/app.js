import Cell, { Test } from 'cell.js'
// create a new pixi application, all things inside the application must fit within this window
const app = new PIXI.Application(
    {
        width: window.outerWidth,
        height: window.outerHeight,
        backgroundColor: 0x11111,
        resolution: window.devicePixelRatio || 1,
    }
)
//
// class Cell {
//     constructor(x_coordinate, y_coordinate, dimension) {
//         this.x = x_coordinate;
//         this.y = y_coordinate;
//         this.dimension = dimension;
//     }
//
//     draw(color, app, graphics) {
//         graphic.lineStyle(2, 0x646464, 1)
//         graphics.beginFill(color)
//         graphics.drawRect(this.x, this.y, this.dimension, this.dimension)
//         graphics.endFill()
//         app.stage.addChild(graphics)
//     }
}

let x = new Test(5, 4)
y = x.testing()


// tell the html document to display the pixi application
document.body.appendChild(app.view)

// create container for all cells
let graphic = new PIXI.Graphics();
app.stage.addChild(graphic);

// constants
const cell_dimension = y
const grid_height = window.innerHeight / cell_dimension
const grid_width = window.innerWidth / cell_dimension

//create a matrix of cells
for (let i = 0; i < grid_width; i++) {
    for (let j = 0; j < grid_height; j++)
    {
        let cell = new Cell(i * 45, j * 45, cell_dimension)
        cell.draw(0x000000, app, graphic)
    }
}
