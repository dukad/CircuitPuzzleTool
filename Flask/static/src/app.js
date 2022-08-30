import Cell, {Resistor, VoltageSource, Wire} from './cell.js';
import Button from "./button.js";
import Board from './board.js';


document.body.style.backgroundColor = 'black';
// create a new pixi application, all things inside the application must fit within this window
const app = new PIXI.Application(
    {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        resolution: devicePixelRatio = 5,
        autoDensity: true,
    }
)
app.ticker.maxFPS = 10;
app.resize();



// tell the html document to display the pixi application
document.body.appendChild(app.view)

// constants
const cell_dimension = 50
let r_height = (window.innerHeight % cell_dimension)
let r_width = ((window.innerWidth % cell_dimension))
const grid_height = ((window.innerHeight - r_height)/ cell_dimension)
const grid_width = ((window.innerWidth - r_width) / cell_dimension)
let cell = [];


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
let game = new Board(grid_height, grid_width, cell_dimension, app);
game.initBoard(grid_height, grid_width, cell_dimension);
game.connectCells();
game.drawBar();

game.makeFakeResistor();
game.makeFakeVoltage();
game.makeFakeWire();
game.makeEraser();

window.addEventListener("keydown", onKeyDown)

function onKeyDown(event) {
    // console.log(event.key)
    game.onKeyPress(event.key)
}

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
        //making the cursor a circle

        const hoverIcon = new PIXI.Graphics();
        hoverIcon.beginFill(0xFFC0CB)
        hoverIcon.drawCircle(30, 30 , 30);
        hoverIcon.endFill();

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


let solveButton = new Button(10, window.innerHeight - 80, 100, 50, app, game.cell)
solveButton.draw()
const cursor = new PIXI.Graphics();
cursor.beginFill(0xFFC0CB)
cursor.drawCircle(30, 30, 30);
cursor.endFill();




// testing()
// console.log('finished')
