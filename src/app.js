import Cell from './cell.js';
import Button from "./button.js";

document.body.style.backgroundColor = 'silver';
// create a new pixi application, all things inside the application must fit within this window
const app = new PIXI.Application(
    {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0xFFFFFF,
        resolution: devicePixelRatio = 5,
        autoDensity: true,
    }
)
app.ticker.maxFPS = 15;
app.resize();

// tell the html document to display the pixi application
document.body.appendChild(app.view)

// constants
const cell_dimension = 30
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
        let newCell = new Cell(j, i, cell_dimension, app, cell)
        newCell.draw()
        cell[i][j] = newCell;
        // console.log(newCell.x, newCell.y, j, i)
    }
}
//
// let testvar = '';
//
// window.addEventListener(
//     "keydown",
//     function(event) {MyFunction(event.key)}
// )
//
// function MyFunction (the_Key) {
//     testvar += the_Key
//     alert("Key pressed is: "+testvar);
// }
//
// let test = prompt('enter your name')
// cell[5][5].makePart('Wire')
let testButton = new Button(10, window.innerHeight - 80, 100, 50, app, cell)
testButton.draw()

// let graph = new PIXI.Graphics
//
// graph.beginFill(0x04b504)
// graph.drawRect(this.locationx, this.locationy, this.sizex, this.sizey)
// graph.endFill()
// graph.addChild(this.graphic)