import Cell from './src/cell.js';
// import Wire from './src/wire.js';

document.body.style.backgroundColor = "black";
// create a new pixi application, all things inside the application must fit within this window
const app = new PIXI.Application(
    {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x11111,
        resolution: devicePixelRatio = 5,
        autoDensity: true,
    }
)
app.resize();

// tell the html document to display the pixi application
document.body.appendChild(app.view)

// create container for all cells
// let graphic = new PIXI.Graphics();
// app.stage.addChild(graphic);
// graphic.lineStyle(2, 0x646464, 1)
// graphic.beginFill(0x646464)
// graphic.drawRect(50, 50 , 100, 100)
// graphic.endFill()
// app.stage.addChild(graphic)

// graphic.interactive = true;
// graphic.buttonMode = true;
//
// graphic.on('pointerdown', () => onClick(app, graphic));
//
// let cell_dimension = 45;
//
// onClick(app, graphic2) {
//     graphic2.lineStyle(2, 0x1f1f1f, 1);
//     graphic2.beginFill(0x04b504);
//     graphic2.drawCircle(cell_dimension/2, cell_dimension/2, cell_dimension / 3);
//     graphic2.endFill();
//     app.stage.addChild(graphic2);
// }



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
        let newCell = new Cell(j, i, cell_dimension, app, 0x000000, cell)
        newCell.draw()
        cell[i][j] = newCell;
    }
}
