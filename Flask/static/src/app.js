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


console.log(grid_height)
console.log(grid_width)
let game = new Board(grid_height, grid_width, cell_dimension, app);
game.create();


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
    game.toolbar.fakeResistor.data = event.data;
    game.resistor = true;
    console.log('onDragStartR called')


}

function onDragEndR()
{
    this.alpha = 0;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
    game.toolbar.fakeResistor.data = null;
   game.toolbar.fakeResistor.x =0;
   game.toolbar.fakeResistor.y =0;
   game.toolbar.fakeResistor.rectangle.x =0;
    game.toolbar.fakeResistor.rectangle.y =0;
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
        game.toolbar.fakeResistor.position.x = newPosition.x-50;
        game.toolbar.fakeResistor.position.y = newPosition.y-50;
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
    game.toolbar.fakeVoltage.data = event.data;
    game.toolbar.voltage = true;

}

function onDragEndV()
{
    this.alpha = 0;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
    game.toolbar.fakeVoltage.x =0;
    game.toolbar.fakeVoltage.y =0;
    game.toolbar.fakeVoltage.rectangle.x =0;
    game.toolbar.fakeVoltage.rectangle.y =0;
    game.toolbar.fakeVoltage.data = null;
}

function onDragMoveV()
{
    if (this.dragging)
    {
        this.alpha =0;
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x-50;
        this.position.y = newPosition.y-80;
        game.toolbar.fakeVoltage.position.x = newPosition.x-50;
        game.toolbar.fakeVoltage.position.y = newPosition.y-80;

    }
}

function onDragStartW(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    game.toolbar.wire = true;

    this.dragging = true;
    game.toolbar.fakeWire.data = event.data;
}

function onDragEndW()
{
    this.dragging = false;
    this.position.x = 0;
    this.position.y = 0;

    // set the interaction data to null
    this.data = null;
    game.toolbar.fakeWire.data = null;

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
game.toolbar.fakeResistor.rectangle.on('mousedown', onDragStartR);
game.toolbar.fakeResistor.rectangle.on('mouseup', onDragEndR);
game.toolbar.fakeResistor.rectangle.on('mousemove', onDragMoveR);
game.toolbar.fakeResistor.rectangle.on('touchstart', onDragStartR);
game.toolbar.fakeResistor.rectangle.on('mouseupoutside', onDragEndR);
game.toolbar.fakeResistor.rectangle.on('touchend', onDragEndR);
game.toolbar.fakeResistor.rectangle.on('touchendoutside', onDragEndR);
game.toolbar.fakeResistor.rectangle.on('touchmove', onDragMoveR);

game.toolbar.fakeVoltage.rectangle.on('mousedown', onDragStartV);
game.toolbar.fakeVoltage.rectangle.on('mouseup', onDragEndV);
game.toolbar.fakeVoltage.rectangle.on('mousemove', onDragMoveV);
game.toolbar.fakeVoltage.rectangle.on('touchstart', onDragStartV);
game.toolbar.fakeVoltage.rectangle.on('mouseupoutside', onDragEndV);
game.toolbar.fakeVoltage.rectangle.on('touchend', onDragEndV);
game.toolbar.fakeVoltage.rectangle.on('touchendoutside', onDragEndV);
game.toolbar.fakeVoltage.rectangle.on('touchmove', onDragMoveV);

game.toolbar.fakeWire.on('mousedown', onDragStartW);
game.toolbar.fakeWire.on('mouseup', onDragEndW);
game.toolbar.fakeWire.on('mousemove', onDragMoveW);
game.toolbar.fakeWire.on('touchstart', onDragStartW);
game.toolbar.fakeWire.on('mouseupoutside', onDragEndW);
game.toolbar.fakeWire.on('touchend', onDragEndW);
game.toolbar.fakeWire.on('touchendoutside', onDragEndW);
game.toolbar.fakeWire.on('touchmove', onDragMoveW);

game.toolbar.eraser.on('click', onClickE);


let solveButton = new Button(10, window.innerHeight - 80, 100, 50, app, game.cell)
solveButton.draw()
const cursor = new PIXI.Graphics();
cursor.beginFill(0xFFC0CB)
cursor.drawCircle(30, 30, 30);
cursor.endFill();




// testing()
// console.log('finished')
