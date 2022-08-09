import {Wire} from "./src/cell";

class Cell{
    constructor(app, x_coordinate, y_coordinate, dimension,){

        this.graphic = new PIXI.Graphics; //Container for the graphics of each cell
        this.drawingGraphic = new PIXI.Graphics; //just the drawing of the wire/parts

        this.app = app; //pixi application
        this.x = x_coordinate; //index coordinates of the cell
        this.y = y_coordinate;
        this.dimension = dimension; // size of the cell
        this.graphic.interactive = true; // make a button
        this.graphic.buttonMode = true;

       this.connectedCells = [];
       this.matrix = [];



    }

}


