import Cell, { Resistor, VoltageSource } from './src/cell.js';
// import {VoltageSource} from "./src/component";
// import { Resistor } from './src/component.js';
// import Wire from './src/wire.js';

//document.body.style.backgroundColor = "black";
// create a new pixi application, all things inside the application must fit within this window
const app = new PIXI.Application(
    {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x666565,
        resolution: devicePixelRatio = 5,
        autoDensity: true,
    }
)
app.resize();

// tell the html document to display the pixi application
document.body.appendChild(app.view)

// constants
const cell_dimension = 45
let r_height = (window.innerHeight % cell_dimension)
let r_width = ((window.innerWidth % cell_dimension))
const grid_height = ((window.innerHeight - r_height)/ cell_dimension)
const grid_width = ((window.innerWidth - r_width) / cell_dimension)
let cell = [];

console.log(grid_height)
console.log(grid_width)

//fill up the 1D array with empty arrays to make it 2 dimensional
for (let i = 0; i < grid_height; i++) {
    cell[i] = []
}
// create a matrix of cells
for (let i = 0; i < grid_height; i++) {
    for (let j = 0; j < grid_width; j++)
    {
        let newCell = new Cell(j, i, cell_dimension, app, 0x666565, cell)
        newCell.draw()
        cell[i][j] = newCell;
        // console.log(newCell.x, newCell.y, j, i)
    }
}
//
let newRes = new Resistor(5, 5, cell_dimension, app, 0x000000, cell, 15);
cell[5][5] = newRes;
newRes.draw();
newRes.render();

let newVS = new VoltageSource(8, 8, cell_dimension, app, 0x000000, cell, 15);
cell[8][8] = newVS;
newVS.draw();
newVS.render();