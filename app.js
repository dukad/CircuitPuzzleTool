import Cell from './src/cell.js';

// create a new pixi application, all things inside the application must fit within this window
const app = new PIXI.Application(
    {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x11111,
        // resolution: window.devicePixelRatio || 1,
    }
)

// tell the html document to display the pixi application
document.body.appendChild(app.view)

// create container for all cells
let graphic = new PIXI.Graphics();
app.stage.addChild(graphic);

// constants
const cell_dimension = 45
let r_height = (window.innerHeight % cell_dimension)
let r_width = ((window.innerWidth % cell_dimension))
const grid_height = ((window.innerHeight - r_height)/ cell_dimension)
const grid_width = ((window.innerWidth - r_width) / cell_dimension)
let cell = [];

//fill up the 1D array with empty arrays to make it 2 dimensional
for (let i = 0; i < grid_height; i++) {
    cell[i] = []
}

//create a matrix of cells
for (let i = 0; i < grid_height; i++) {
    for (let j = 0; j < grid_width; j++)
    {
        let rect;
        rect = new PIXI.Rectangle(j * 45, i * 45, cell_dimension, cell_dimension);
        let newCell = new Cell(j * 45, i * 45, cell_dimension, rect, 0x000000)
        newCell.draw(app, graphic)
        // newCell.onClick(app, graphic)
        cell[i][j] = newCell;
        cell[i][j].rect.interactive = true;
        cell[i][j].rect.buttonMode = true;
    }
}


for (let i = 0; i < grid_height; i++) {
    for (let j = 0; j < grid_width; j++) {
        // cell[i][j].rect.on("pointerdown",
    }
}



