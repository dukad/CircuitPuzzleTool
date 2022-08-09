import Cell, { Resistor, VoltageSource } from './src/cell.js';
// import {VoltageSource} from "./src/component";
// import { Resistor } from './src/component.js';
// import Wire from './src/wire.js';


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
app.resize();

// tell the html document to display the pixi application
document.body.appendChild(app.view)


class Board{

    constructor(grid_height, grid_width, cell_dimension){
        this.cell = [];
        this.grid_height = grid_height;
        this.grid_width = grid_width;
        this.cell_dimension = cell_dimension;
    }

    initBoard(){
        for (let i = 0; i < this.grid_height; i++) {

            this.cell[i] = [];
        }
// create a matrix of cells
        for (let i = 0; i < this.grid_height; i++) {
            for (let j = 0; j < this.grid_width; j++)
            {
                //adding the new cell to the array
                let newCell = new Cell(j, i, this.cell_dimension, app, this.cell)
                newCell.draw()
                this.cell[i][j] = newCell;



            }
        }
    }

    connectCells(){
        for (let i = 0; i < this.grid_height; i++) {
            for (let j = 0; j < this.grid_width; j++)
            {

                //this.cell[2][2].top = this.cell[1][2];
                if(i !== 0){
                    this.cell[i][j].top = this.cell[i-1][j];
                }

                if( j !== 0){
                    this.cell[i][j].left = this.cell[i][j-1];
                }

                if(j < this.grid_width-1){
                    this.cell[i][j].right = this.cell[i][j+1];
                }
                if(i < this.grid_height-1){
                    this.cell[i][j].bottom = this.cell[i+1][j];
                }












            }
        }
    }
}
// constants
const cell_dimension = 45
let r_height = (window.innerHeight % cell_dimension)
let r_width = ((window.innerWidth % cell_dimension))
const grid_height = ((window.innerHeight - r_height)/ cell_dimension)
const grid_width = ((window.innerWidth - r_width) / cell_dimension)
//let cell = [];

console.log(grid_height)
console.log(grid_width)
let game = new Board(grid_height, grid_width, cell_dimension);
game.initBoard(grid_height, grid_width, cell_dimension);
game.connectCells();

console.log(game.cell[6][3].bottom.x)




