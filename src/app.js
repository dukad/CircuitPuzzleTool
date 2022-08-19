import Cell, {Resistor, VoltageSource, Wire} from './cell.js';
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


class Board {

    constructor(grid_height, grid_width, cell_dimension) {
        this.cell = [];
        this.grid_height = grid_height;
        this.grid_width = grid_width;
        this.cell_dimension = cell_dimension;
        this.fakeResistor = new PIXI.Graphics();
        this.fakeVoltage  = new PIXI.Graphics();
        this.fakeWire = new PIXI.Graphics();
        this.eraser = null;
        this.resistor = false;
        this.voltage = false;
        this.wire = false;
        this.erased = false;





        this.makeFakeResistor();
        this.makeFakeVoltage();
        this.makeFakeWire();
        this.makeEraser();

    }

    initBoard() {
        for (let i = 0; i < this.grid_height; i++) {

            this.cell[i] = [];
        }
// create a matrix of cells
        for (let i = 0; i < this.grid_height; i++) {
            for (let j = 0; j < this.grid_width; j++) {
// adding the new cell to the array
                let newCell = new Cell(j, i, this.cell_dimension, app, this.cell, this)
                newCell.draw()
                this.cell[i][j] = newCell;


            }


        }
    }


    connectCells() {
        for (let i = 0; i < this.grid_height; i++) {
            for (let j = 0; j < this.grid_width; j++) {

//this.cell[2][2].top = this.cell[1][2];
                if (i !== 0) {
                    this.cell[i][j].top = this.cell[i - 1][j];
                }

                if (j !== 0) {
                    this.cell[i][j].left = this.cell[i][j - 1];
                }

                if (j < this.grid_width - 1) {
                    this.cell[i][j].right = this.cell[i][j + 1];
                }
                if (i < this.grid_height - 1) {
                    this.cell[i][j].bottom = this.cell[i + 1][j];
                }

            }
        }
    }
    drawBar(){
        const bar = new PIXI.Graphics();
        bar.beginFill(0x808080)
        bar.drawRect(17, 20 , 60, 140)
        bar.endFill();

        app.stage.addChild(bar);

    }
    makeFakeResistor(){
        //this.resistor = false;

        const xPixels = 1 *30;
        const yPixels = 2 * 30;

        const dimension = 30;

        const x = xPixels;
        const y = yPixels + dimension/2
        this.fakeResistor.interactive = true;
        this.fakeResistor.dragging = false;

        app.stage.addChild(this.fakeResistor);
        this.fakeResistor.lineStyle(5, 0x04b504)

        this.fakeResistor.moveTo(x, y);
        this.fakeResistor.lineTo(x+dimension/10, y)
        this.fakeResistor.lineTo(x+dimension/5, y - dimension/4)
        this.fakeResistor.lineTo(x+dimension*2/5, y + dimension/4)
        this.fakeResistor.lineTo(x+dimension*3/5, y - dimension/4)
        this.fakeResistor.lineTo(x+dimension*4/5, y + dimension/4)
        this.fakeResistor.lineTo(x+dimension*9/10, y)
        this.fakeResistor.lineTo(x+dimension, y)

        console.log("x pson " + this.fakeResistor.x);
        console.log("y posn" + this.fakeResistor.y);

//hitbox
        this.fakeResistor.rectangle = new PIXI.Graphics();
        this.fakeResistor.rectangle.beginFill( 0x04b504)
        this.fakeResistor.rectangle.drawRect(30, 60, 30, 30);
        this.fakeResistor.rectangle.interactive = true;
        this.fakeResistor.rectangle.dragging = false;
        this.fakeResistor.rectangle.alpha = 0;

        this.fakeResistor.rectangle.endFill();

        app.stage.addChild(this.fakeResistor.rectangle);

    }

    makeFakeVoltage(){

        const xPixels = 1 *30;
        const yPixels = 3 * 30;
        const dimension = 30;

        let x = xPixels;
        let y = yPixels + dimension / 2;
        this.fakeVoltage.moveTo(x, y);
        this.fakeVoltage.lineTo(x + dimension / 6, y)
        this.fakeVoltage.moveTo(x + dimension * 5 / 6, y)
        this.fakeVoltage.lineTo(x + dimension, y)
        this.fakeVoltage.drawCircle(x + dimension / 2, y, dimension / (3))

        this.fakeVoltage.lineStyle(2, 0x04b504)
        //draw plus sign
        this.fakeVoltage.moveTo(x + dimension * 6 / 12, y)
        this.fakeVoltage.lineTo(x + dimension * 8 / 12, y)
        this.fakeVoltage.moveTo(x + dimension * 7 / 12, y - dimension * 1 / 12)
        this.fakeVoltage.lineTo(x + dimension * 7 / 12, y + dimension * 1 / 12)
        //draw minus sign
        this.fakeVoltage.moveTo(x + dimension * 5 / 12, y - dimension * 1 / 12)
        this.fakeVoltage.lineTo(x + dimension * 5 / 12, y + dimension * 1 / 12)

        this.fakeVoltage.lineStyle(5, 0x04b504);


            this.fakeVoltage.moveTo(x, y);
            this.fakeVoltage.lineTo(x - dimension / 4, y);
            this.fakeVoltage.moveTo(x + dimension, y);
            this.fakeVoltage.lineTo(x + dimension * 5 / 4, y);

            app.stage.addChild(this.fakeVoltage);
            //hitbox


        this.fakeVoltage.rectangle = new PIXI.Graphics();
        this.fakeVoltage.rectangle.beginFill( 0x04b504)
        this.fakeVoltage.rectangle.drawRect(30, 90, 30, 30);
        console.log("volt " + this.fakeVoltage.x);
        console.log("volt" + this.fakeVoltage.y);

        this.fakeVoltage.rectangle.interactive = true;
        this.fakeVoltage.rectangle.dragging = false;
        this.fakeVoltage.rectangle.alpha = 0;

        this.fakeVoltage.rectangle.endFill();

        app.stage.addChild(this.fakeVoltage.rectangle);



    }

    makeFakeWire(){
        this.fakeWire.beginFill(0x04b504);
        this.fakeWire.drawRect(30, 130, 30, 5)
        this.fakeWire.drawCircle(30, 132 , 7);
        this.fakeWire.drawCircle(60, 132 , 7);
        this.fakeWire.interactive = true;
        this.fakeWire.dragging = false;
        this.fakeWire.endFill();



        app.stage.addChild(this.fakeWire);





    }

    makeEraser(){

        this.eraser = new PIXI.Text('Eraser', {fontFamily : 'Arial', fontSize: 18, fill :0x04b504, align : 'center' });
        this.eraser.x = 20;
        this.eraser.y = 35;
        this.eraser.interactive = true;


        app.stage.addChild(this.eraser);
    }
}

    /*makeFakeResistor(){
        const xPixels = 1 *30;
        const yPixels = 2 * 30;

        const dimension = 30;
        //const fakeResistor = new PIXI.Graphics();
        const x = xPixels;
        const y = yPixels + dimension/2
        this.fakeResistor.interactive = true;
        this.fakeResistor.dragging = false;

        app.stage.addChild(this.fakeResistor);
        this.fakeResistor.lineStyle(5, 0x04b504)

        this.fakeResistor.moveTo(x, y);
        this.fakeResistor.lineTo(x+dimension/10, y)
        this.fakeResistor.lineTo(x+dimension/5, y - dimension/4)
        this.fakeResistor.lineTo(x+dimension*2/5, y + dimension/4)
        this.fakeResistor.lineTo(x+dimension*3/5, y - dimension/4)
        this.fakeResistor.lineTo(x+dimension*4/5, y + dimension/4)
        this.fakeResistor.lineTo(x+dimension*9/10, y)
        this.fakeResistor.lineTo(x+dimension, y)


//hitbox
        this.fakeResistor.rectangle = new PIXI.Graphics();
        this.fakeResistor.rectangle.beginFill( 0x04b504)
        this.fakeResistor.rectangle.drawRect(30, 60, 30, 30);
        this.fakeResistor.rectangle.interactive = true;
        this.fakeResistor.rectangle.dragging = false;
        this.fakeResistor.rectangle.alpha = 0;

        this.fakeResistor.rectangle.endFill();

        app.stage.addChild(this.fakeResistor.rectangle);





    }*/

console.log(grid_height)
console.log(grid_width)
let game = new Board(grid_height, grid_width, cell_dimension);
game.initBoard(grid_height, grid_width, cell_dimension);
game.connectCells();
game.drawBar();

game.makeFakeResistor();
game.makeFakeVoltage();
game.makeFakeWire();
game.makeEraser();






function onDragStartR(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0;
    this.dragging = true;
    game.fakeResistor.data = event.data;
    game.resistor = true;
    console.log('onDragStartR called')


}

function onDragEndR()
{



    this.alpha = 0;

    this.dragging = false;


    // set the interaction data to null
    this.data = null;
    game.fakeResistor.data = null;
   game.fakeResistor.x =0;
   game.fakeResistor.y =0;
   game.fakeResistor.rectangle.x =0;
    game.fakeResistor.rectangle.y =0;
    console.log("onDragEndR called")






}

function onDragMoveR()
{
    if (this.dragging)
    {
        this.alpha =0;
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x-50;
        this.position.y = newPosition.y-50;
        game.fakeResistor.position.x = newPosition.x-50;
        game.fakeResistor.position.y = newPosition.y-50;



    }
}

function onDragStartV(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0;
    this.dragging = true;
    game.fakeVoltage.data = event.data;
    game.voltage = true;

}

function onDragEndV()
{
    this.alpha = 0;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
    game.fakeVoltage.x =0;
    game.fakeVoltage.y =0;
    game.fakeVoltage.rectangle.x =0;
    game.fakeVoltage.rectangle.y =0;
    game.fakeVoltage.data = null;



}

function onDragMoveV()
{
    if (this.dragging)
    {
        this.alpha =0;
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x-50;
        this.position.y = newPosition.y-80;
        game.fakeVoltage.position.x = newPosition.x-50;
        game.fakeVoltage.position.y = newPosition.y-80;



    }
}

function onDragStartW(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    game.wire = true;


    this.dragging = true;
    game.fakeWire.data = event.data;
}

function onDragEndW()
{


    this.dragging = false;
    this.position.x = 0;
    this.position.y = 0;




    // set the interaction data to null
    this.data = null;
    game.fakeWire.data = null;

}

function onDragMoveW()
{
    if (this.dragging)
    {

        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x-40;
        this.position.y = newPosition.y-120;




    }
}


function onClickE(){
    //idk how to negate in javascript lol
    console.log('on click e running')
    if(game.erased === false){
        game.erased = true;
    }
    else{
        game.erased = false;
    }

}
game.fakeResistor.rectangle.on('mousedown', onDragStartR);
game.fakeResistor.rectangle.on('mouseup', onDragEndR);
game.fakeResistor.rectangle.on('mousemove', onDragMoveR);
game.fakeResistor.rectangle.on('touchstart', onDragStartR);
game.fakeResistor.rectangle.on('mouseupoutside', onDragEndR);
game.fakeResistor.rectangle.on('touchend', onDragEndR);
game.fakeResistor.rectangle.on('touchendoutside', onDragEndR);
game.fakeResistor.rectangle.on('touchmove', onDragMoveR);

game.fakeVoltage.rectangle.on('mousedown', onDragStartV);
game.fakeVoltage.rectangle.on('mouseup', onDragEndV);
game.fakeVoltage.rectangle.on('mousemove', onDragMoveV);
game.fakeVoltage.rectangle.on('touchstart', onDragStartV);
game.fakeVoltage.rectangle.on('mouseupoutside', onDragEndV);
game.fakeVoltage.rectangle.on('touchend', onDragEndV);
game.fakeVoltage.rectangle.on('touchendoutside', onDragEndV);
game.fakeVoltage.rectangle.on('touchmove', onDragMoveV);

game.fakeWire.on('mousedown', onDragStartW);
game.fakeWire.on('mouseup', onDragEndW);
game.fakeWire.on('mousemove', onDragMoveW);
game.fakeWire.on('touchstart', onDragStartW);
game.fakeWire.on('mouseupoutside', onDragEndW);
game.fakeWire.on('touchend', onDragEndW);
game.fakeWire.on('touchendoutside', onDragEndW);
game.fakeWire.on('touchmove', onDragMoveW);

game.eraser.on('click', onClickE);

let testButton = new Button(10, window.innerHeight - 80, 100, 50, app, cell)
testButton.draw()

// let graph = new PIXI.Graphics
//
// graph.beginFill(0x04b504)
// graph.drawRect(this.locationx, this.locationy, this.sizex, this.sizey)
// graph.endFill()
// graph.addChild(this.graphic)