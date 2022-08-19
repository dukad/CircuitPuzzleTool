// export default class Cell {
//     constructor(x_coordinate, y_coordinate, dimension, app, matrix, board) {
//         this.graphic = new PIXI.Graphics; //Container for the graphics of each cell
//         this.drawingGraphic = new PIXI.Graphics;
//         this.app = app; //pixi application
//         this.x = x_coordinate; //index coordinates of the cell
//         this.y = y_coordinate;
//         this.dimension = dimension; // size of the cell
//         this.graphic.interactive = true; // make a button
//         this.graphic.buttonMode = true;
//         this.graphic.on('click', () => this.onClick()) //run the onClick method when clicked
//         this.graphic.on('rightdown', () => this.onRightClick());
//         this.graphic.on('mouseup', () => this.onMouseUp())
//         this.graphic.on('touchend', () => this.onMouseUp())
//         this.graphic.on('touchendoutside', () => this.onMouseUp())
//         this.graphic.on('mouseupoutside', () => this.onMouseUp())
//
//         this.xpixels = this.x * this.dimension; // pixel coordinates of the cell
//         this.ypixels = this.y * this.dimension;
//         this.matrix = matrix; //external matrix of the cell
//         this.connected_parts = new Set();
//         this.graphic.on('mouseover', () => this.onHover());
//         this.type = 'Cell'
//         this.text = new PIXI.Text('', {fontFamily : 'Droid Serif', fontSize: 12, fill : 0x04b504, align : 'center'});
//         this.reference = null
//         this.board = board;
//
//         this.top = null;
//         this.bottom = null;
//         this.right = null;
//         this.left = null;
//
//
//
//     }
//
//     connect(part) { //connect two adjacent wires
//         /**
//          * connect two wires both in the graph and visually
//          */
//         //add to graph
//         this.connected_parts.add(part);
//         part.connected_parts.add(this);
//         //display in the correct direction
//         let direction = this.find_direction(part);
//         this.display_orient(direction)
//         part.display_orient(this.reverse_direction(direction))
//
//     }
//
//     display_orient(direction) {
//         //this function does nothing unless overridden by a subclass
//     }
//
//     disconnect(part) {
//         /**
//          * disconnects two parts from each other
//          * @param {Wire, Component} part connected part meant to be disconnected
//          */
//         this.connected_parts.delete(part);
//         part.connected_parts.delete(this);
//         let direction = this.find_direction(part);
//         this.undisplay(direction);
//         part.undisplay(this.reverse_direction(direction));
//     }
//
//     undisplay(direction) {
//         /**
//          * this function is designed to be overridden, the opposite of the display_orient method
//          * @param {number} direction integer 0-8 corresponding to directions
//          */
//         alert('Called \' undisplay \' method on an empty cell')
//     }
//
//     reverse_direction(dir) {
//         /**
//          * finds the reversed direction of the input given
//          * @type {number}
//          */
//         let rem = dir % 3;
//         let div = (dir - rem) / 3;
//         let rem_reverse = Math.abs(rem - 2);
//         let div_reverse = Math.abs(div - 2);
//         div_reverse *= 3;
//         return (div_reverse + rem_reverse);
//     }
//
//     find_direction(part) {
//         /**
//          * returns the direction
//          * @type {Wire, Component}
//          */
//         let x_diff = part.x - this.x; //find the direction which the cell is in
//         let y_diff = part.y - this.y;
//         let direction = 0; // initialize as top-left
//         direction += (y_diff + 1)*3;
//         direction += (x_diff + 1);
//         if (((direction !== 4) && (direction >= 0)) && (direction <= 8)) { //if the direction is not in the center
//             return direction;
//         } else {
//             return null;
//         }
//     }
//
//     draw() {
//         /**
//          * draws the cell that backgrounds the components
//          */
//         this.graphic.clear() // destroy any current lines draw on
//         this.graphic.lineStyle(2, 0x2f2f2f, 1) // set lines which border cells and become the grid
//         this.graphic.beginFill(0x000000) //fill with black
//         this.graphic.drawRect(this.xpixels, this.ypixels, this.dimension, this.dimension) //create square
//         this.graphic.endFill()
//         this.app.stage.addChild(this.graphic) //stage this graphic
//         // console.log('drawing', this.x, this.y)
//     }
//
//     onClick() {
//         /**
//          * onClick method for all cells, wires, and components
//          */
//
//         if (this instanceof Wire) {
//             this.makePart('Resistor');
//         } else if (this instanceof Resistor) {
//             this.makePart('VoltageSource');
//         } else if (this instanceof VoltageSource) {
//             this.makePart('CurrentSource');
//         } else {
//             this.makePart('Wire')
//         }
//         // console.log('onClick running')
//     }
//
//     onRightClick() {
//         /**
//          * onClick method for all cells, wires, and components
//          */
//         if(this instanceof Resistor) {
//             this.makePart('VoltageSource');
//         } else {
//             this.makePart('Resistor')
//         }
//         // console.log('onClick running')
//     }
//
//     rerender() {
//         /**
//          * rerender surrounding parts ensuring everything is up to date
//          */
//         for (let i=-1; i<2; i++) { // iterate through possible directions
//             for (let j=-1; j<2; j++) {
//                 if ((i !== 0) || (j !== 0)) { // don't include the center
//                     let part = this.matrix[Math.abs(this.y + i)][Math.abs(this.x + j)];
//                     if ((part instanceof Wire) || (part instanceof Component)) { //if adjacent objects are a wire
//                         part.render()
//                     }
//                 }
//             }
//         }
//
//     }
//
//
//     makePart(part) {
//         /**
//          * forms a new part in place of whatever was currently present
//          */
//         if ((this instanceof Wire) || (this instanceof Component)) {
//             this.drawingGraphic.clear()
//         }
//         if (this instanceof Component) {
//             this.text.destroy()
//         }
//
//         let newPart;
//         if(part === 'Wire') {
//             newPart = new Wire(this.x, this.y, this.dimension, this.app, this.matrix, this.board); // new wire object with same properties as the cell
//         }
//         else if(part === 'Resistor') {
//             newPart = new Resistor(this.x, this.y, this.dimension, this.app, this.matrix, 15, this.board);
//         }
//         else if(part === 'VoltageSource') {
//             newPart = new VoltageSource(this.x, this.y, this.dimension, this.app, this.matrix, 15, this.board);
//         }
//         else if(part === 'CurrentSource') {
//             newPart = new CurrentSource(this.x, this.y, this.dimension, this.app, this.matrix, 15, this.board)
//         }
//         else {
//             alert('Input non valid circuit part')
//         }
//         this.matrix[this.y][this.x] = newPart; // set the matrix coordinates to the new object
//         // newPart.draw()
//
//         // iterate through possible directions
//         let list = [this.matrix[Math.abs(this.y)][Math.abs(this.x + 1)], this.matrix[Math.abs(this.y)][Math.abs(this.x - 1)], this.matrix[Math.abs(this.y + 1)][Math.abs(this.x)], this.matrix[Math.abs(this.y - 1)][Math.abs(this.x)]]
//         for(let i=0; i<4; i++) {
//             let part = list[i];
//             try {
//                 if ((part instanceof Wire) || (part instanceof Component)) { //if adjacent objects are a wire
//                     newPart.connect(part) // connect this wire with adjacent wires
//                     part.render() //render adjacent wires again
//                     if (part instanceof Component) {
//                         part.refresh();
//                     }
//                     // newPart.render()
//                 }
//             } catch (err) {
//                 // console.log('issue happening in onClick')
//             }
//         }
//         newPart.draw()
//         newPart.render(); //draw wire
//         newPart.rerender();
//         // console.log('made a ', part, 'at', newPart.x, newPart.y)
//         // newPart.connected_parts.forEach(cn => {
//         //     console.log('connected to', cn.x, cn.y)
//         // })
//         this.connected_parts.forEach(cl => {
//             this.disconnect(cl)
//         })
//
//         delete this // delete the original cell object
//
//     }
//
//     onHover() {
//         // if (this.mouseDown) {
//         //     this.makePart('Wire')
//         //     console.log('hi')
//         // }
//     }
//
//     onMouseUp(){
//         if(this.board.resistor === true){
//             this.bottom.makePart('Resistor')
//             this.board.resistor = false;
//
//         }
//
//         if(this.board.wire === true){
//             this.bottom.makePart('Wire')
//             this.board.wire = false;
//         }
//         if(this.board.voltage === true){
//             this.bottom.makePart('VoltageSource')
//             this.board.voltage = false;
//
//         }
//     }
// }
//
//
// export class Wire extends Cell {
//     /**
//      * Circuit Wires
//      * @param x_coordinate position in matrix
//      * @param y_coordinate
//      * @param dimension pixel dimension of the cell
//      * @param app PIXI application
//      * @param matrix matrix holding the cell
//      */
//     constructor(x_coordinate, y_coordinate, dimension, app, matrix, board) {
//         super(x_coordinate, y_coordinate, dimension, app, matrix, board);
//         this.display_directions = new Set();
//         this.type = 'Wire'
//     }
//
//     display_orient(direction) {
//         /**
//          * adds direction to the set of directions needed to display
//          * @type {number}
//          */
//         this.display_directions.add(direction)
//     }
//
//     undisplay(direction) {
//         /**
//          * removes a direction from the display
//          * @type {number}
//          */
//         this.display_directions.delete(direction)
//     }
//
//     create_node(size) {
//         /**
//          * draw a circle of different sizes in the middle of a cell
//          * @param {number} size in pixels
//          */
//         this.drawingGraphic.beginFill(0x04b504);
//         this.drawingGraphic.drawCircle(this.xpixels + this.dimension/2, this.ypixels + this.dimension/2, size);
//         this.drawingGraphic.endFill();
//         this.app.stage.addChild(this.drawingGraphic);
//     }
//
//     render() {
//         /**
//          * recreate the way the object looks on screen
//          */
//         this.drawingGraphic.clear()
//         // this.graphic = new PIXI.Graphics // recreate the item
//         if ((this.display_directions.size !== 2)) { //if you want to see a big circle
//             this.create_node(this.dimension / 4); // create a big node
//         } else {
//             this.create_node(this.dimension / 15); //create a small node
//         }
//         this.draw_a_wire();
//         // console.log(this.x, this.y, this.display_directions, this.connected_parts.size)
//         // console.log(this.connected_parts);
//     }
//
//     draw_a_wire() {
//         /**
//          * actually draw a wire
//          */
//         // this.graphic.lineStyle.re
//         // this.drawingGraphic.clear()
//         this.drawingGraphic.lineStyle(5, 0x04b504, 2); // change the linestyle to thick green
//         this.display_directions.forEach(i => {
//             let dir = i;
//             let x_change = dir % 3; // 0, 1, 2
//             let y_change = (dir - x_change) / 3; //0, 1, 2
//             let x_location = this.xpixels + this.dimension / 2; //center on the cell
//             let y_location = this.ypixels + this.dimension / 2;
//             this.drawingGraphic.moveTo(x_location, y_location); // move to center of cell
//             x_change = (((x_change * this.dimension)) - (this.dimension))/2;
//             y_change = (((y_change * this.dimension)) - (this.dimension))/2;
//             this.drawingGraphic.lineTo(x_location + x_change, y_location + y_change);
//             this.app.stage.addChild(this.drawingGraphic);
//         });
//     }
// }
//
//
//
// export class Component extends Cell {
//     /**
//      * Component subclass of cell containing subclasses for resistors, voltage sources etc.
//      * @param x_coordinate
//      * @param y_coordinate
//      * @param dimension
//      * @param app
//      * @param matrix
//      */
//     constructor(x_coordinate, y_coordinate, dimension, app, matrix, board) {
//         super(x_coordinate, y_coordinate, dimension, app, matrix, board);
//         this.orientation = null;
//         this.unit = ''
//         // this.text = null;
//         this.type = 'Component'
//     }
//
//     display_orient(direction) {
//         /**
//          * change the orientation to a direction
//          */
//         this.orientation = direction;
//     }
//
//     undisplay(direction) {
//         /**
//          * not needed for components
//          */
//     }
//
//     rotate() {
//         /**
//          * rotate the graphic depending on orientation
//          */
//         //set pivot point to the middle
//         this.drawingGraphic.x = this.xpixels + this.dimension / 2;
//         this.drawingGraphic.y = this.ypixels + this.dimension / 2;
//         this.drawingGraphic.pivot.x = this.drawingGraphic.x;
//         this.drawingGraphic.pivot.y = this.drawingGraphic.y;
//         if (((this.orientation === null) || (this.orientation === 3)) || (this.orientation === 5)) {
//             this.drawingGraphic.rotation = 0;
//         } else if ((this.orientation === 1) || (this.orientation === 7)) {
//             this.drawingGraphic.rotation = -3.1415 / 2
//         } else if ((this.orientation === 0) || (this.orientation === 8)) {
//             this.drawingGraphic.rotation = 5 * 3.1415 / 4
//         } else if ((this.orientation === 2) || (this.orientation === 6)) {
//             this.drawingGraphic.rotation = 5 * 3.1415 * 3 / 4;
//         }
//     }
//
//     refresh() {
//         for (let i=-1; i<2; i++) { // iterate through possible directions
//             for (let j=-1; j<2; j++) {
//                 if ((i !== 0) || (j !== 0)) { // don't include the center
//                     let part = this.matrix[Math.abs(this.y + i)][Math.abs(this.x + j)];
//                     if ((part instanceof Wire) || (part instanceof Component)) { //if adjacent objects are a wire
//                         let dir = this.find_direction(part)
//                         if((dir === this.orientation) || (this.reverse_direction(dir) === this.orientation)) {
//                             this.connect(part)
//                             // console.log('connected in refresh')
//                         } else {
//                             this.disconnect(part) // connect this wire with adjacent wires
//                         }
//                         if(part instanceof Wire) {
//                             part.render();
//                         }
//                     }
//                 }
//             }
//
//         }
//     }
//
//     render_value() {
//         /**
//          * render the text object that displays the value of the resistor
//          */
//         this.text.destroy()
//         this.text = new PIXI.Text(this.value.toString() + ' ' + this.unit, {fontFamily : 'Droid Serif', fontSize: 12, fill : 0x04b504, align : 'center'});
//         this.text.x = this.xpixels + (this.dimension*16/15)
//         this.text.y = this.ypixels + this.dimension*2/5
//         this.app.stage.addChild(this.text)
//
//         this.text.interactive = true;
//         this.text.buttonMode = true;
//         this.text.on('pointerdown', () => this.onTextClick())
//     }
//
//     onTextClick() {
//         console.log('clicking text')
//     }
//
// }
//
// export class Resistor extends Component {
//     /**
//      * Resistor component
//      * @param x_coordinate
//      * @param y_coordinate
//      * @param dimension
//      * @param app
//      * @param matrix
//      * @param value
//      */
//     constructor(x_coordinate, y_coordinate, dimension, app, matrix, value, board) {
//         super(x_coordinate, y_coordinate, dimension, app, matrix, board);
//         this.value = value;
//         this.unit = 'Ω';
//         this.abbr = 'R'
//     }
//
//     render() {
//         /**
//          * render method for resistor!
//          */
//         // this.graphic.clear() // destroy any current lines draw on
//         // this.graphic = new PIXI.Graphics // recreate the item
//         this.drawingGraphic.clear()
//         this.app.stage.addChild(this.drawingGraphic);
//         this.drawingGraphic.lineStyle(5, 0x04b504); // change the linestyle to thick green
//
//         this.draw_a_resistor()
//         this.rotate()
//         this.refresh()
//
//         this.render_value()
//         // console.log(this.connected_parts);
//     }
//
//     draw_a_resistor() {
//         /**
//          * Creates the PIXI graphic for a resistor
//          */
//         let x = this.xpixels;
//         let y = this.ypixels + this.dimension/2;
//         this.drawingGraphic.moveTo(x, y);
//         this.drawingGraphic.lineTo(x+this.dimension/10, y)
//         this.drawingGraphic.lineTo(x+this.dimension/5, y - this.dimension/4)
//         this.drawingGraphic.lineTo(x+this.dimension*2/5, y + this.dimension/4)
//         this.drawingGraphic.lineTo(x+this.dimension*3/5, y - this.dimension/4)
//         this.drawingGraphic.lineTo(x+this.dimension*4/5, y + this.dimension/4)
//         this.drawingGraphic.lineTo(x+this.dimension*9/10, y)
//         this.drawingGraphic.lineTo(x+this.dimension, y)
//
//         if ((this.orientation === 0) || (this.orientation === 8)) {
//             this.drawingGraphic.moveTo(x, y);
//             this.drawingGraphic.lineTo(x - this.dimension / 4, y);
//             this.drawingGraphic.moveTo(x + this.dimension, y);
//             this.drawingGraphic.lineTo(x + this.dimension * 5 / 4, y);
//         } else if ((this.orientation === 2) || (this.orientation === 6)) {
//             this.drawingGraphic.moveTo(x, y);
//             this.drawingGraphic.lineTo(x - this.dimension / 4, y);
//             this.drawingGraphic.moveTo(x + this.dimension, y);
//             this.drawingGraphic.lineTo(x + this.dimension * 5 / 4, y);
//         }
//     }
//
// }
//
//
// export class VoltageSource extends Component {
//     /**
//      * Voltage Source Component
//      * @param x_coordinate
//      * @param y_coordinate
//      * @param dimension
//      * @param app
//      * @param matrix
//      * @param value
//      */
//     constructor(x_coordinate, y_coordinate, dimension, app, matrix, value, board) {
//         super(x_coordinate, y_coordinate, dimension, app, matrix);
//         this.value = value;
//         this.unit = 'V';
//         this.abbr = 'V'
//         // this.text = null;
//     }
//
//     render() {
//         /**
//          * delete old graphic and draw a new voltage source in correct orientation
//          */
//         // this.graphic.destroy() // destroy any current lines draw on
//         // this.graphic = new PIXI.Graphics // recreate the item
//         this.drawingGraphic.clear()
//         this.app.stage.addChild(this.drawingGraphic);
//         this.drawingGraphic.lineStyle(5, 0x04b504); // change the linestyle to thick green
//
//         this.draw_a_voltagesource();
//         this.rotate()
//
//         this.refresh()
//         this.render_value()
//         // console.log(this.connected_parts);
//     }
//
//     draw_a_voltagesource() {
//         /**
//          * PIXI drawing of voltage source
//          */
//         let x = this.xpixels;
//         let y = this.ypixels + this.dimension / 2;
//         this.drawingGraphic.moveTo(x, y);
//         this.drawingGraphic.lineTo(x + this.dimension / 6, y)
//         this.drawingGraphic.moveTo(x + this.dimension * 5 / 6, y)
//         this.drawingGraphic.lineTo(x + this.dimension, y)
//         this.drawingGraphic.drawCircle(x + this.dimension / 2, y, this.dimension / (3))
//
//         this.drawingGraphic.lineStyle(2, 0x04b504)
//         //draw plus sign
//         this.drawingGraphic.moveTo(x + this.dimension * 6 / 12, y)
//         this.drawingGraphic.lineTo(x + this.dimension * 8 / 12, y)
//         this.drawingGraphic.moveTo(x + this.dimension * 7 / 12, y - this.dimension * 1 / 12)
//         this.drawingGraphic.lineTo(x + this.dimension * 7 / 12, y + this.dimension * 1 / 12)
//         //draw minus sign
//         this.drawingGraphic.moveTo(x + this.dimension * 5 / 12, y - this.dimension * 1 / 12)
//         this.drawingGraphic.lineTo(x + this.dimension * 5 / 12, y + this.dimension * 1 / 12)
//
//         this.drawingGraphic.lineStyle(5, 0x04b504);
//
//         if ((this.orientation === 0) || (this.orientation === 8)) {
//             this.drawingGraphic.moveTo(x, y);
//             this.drawingGraphic.lineTo(x - this.dimension / 4, y);
//             this.drawingGraphic.moveTo(x + this.dimension, y);
//             this.drawingGraphic.lineTo(x + this.dimension * 5 / 4, y);
//         } else if ((this.orientation === 2) || (this.orientation === 6)) {
//             this.drawingGraphic.moveTo(x, y);
//             this.drawingGraphic.lineTo(x - this.dimension / 4, y);
//             this.drawingGraphic.moveTo(x + this.dimension, y);
//             this.drawingGraphic.lineTo(x + this.dimension * 5 / 4, y);
//         }
//     }
// }
//
//
//
// export class CurrentSource extends Component {
//     /**
//      * Voltage Source Component
//      * @param x_coordinate
//      * @param y_coordinate
//      * @param dimension
//      * @param app
//      * @param matrix
//      * @param value
//      */
//     constructor(x_coordinate, y_coordinate, dimension, app, matrix, value, board) {
//         super(x_coordinate, y_coordinate, dimension, app, matrix, board);
//         this.value = value;
//         this.unit = 'A';
//         this.abbr = 'I'
//         // this.text = null;
//     }
//
//     render() {
//         /**
//          * delete old graphic and draw a new voltage source in correct orientation
//          */
//         // this.graphic.destroy() // destroy any current lines draw on
//         // this.graphic = new PIXI.Graphics // recreate the item
//         this.drawingGraphic.clear()
//         this.app.stage.addChild(this.drawingGraphic);
//         this.drawingGraphic.lineStyle(5, 0x04b504); // change the linestyle to thick green
//
//         this.draw_a_currentsource();
//         this.rotate()
//
//         this.refresh()
//         this.render_value()
//         // console.log(this.connected_parts);
//     }
//
//     draw_a_currentsource() {
//         /**
//          * PIXI drawing of voltage source
//          */
//         let x = this.xpixels;
//         let y = this.ypixels + this.dimension / 2;
//         this.drawingGraphic.moveTo(x, y);
//         this.drawingGraphic.lineTo(x + this.dimension / 6, y)
//         this.drawingGraphic.moveTo(x + this.dimension * 5 / 6, y)
//         this.drawingGraphic.lineTo(x + this.dimension, y)
//         this.drawingGraphic.drawCircle(x + this.dimension / 2, y, this.dimension / (3))
//
//         this.drawingGraphic.lineStyle(2, 0x04b504)
//         //draw plus sign
//         this.drawingGraphic.moveTo(x + this.dimension *  1/3, y)
//         this.drawingGraphic.lineTo(x + this.dimension * 2/3, y)
//         this.drawingGraphic.moveTo(x + this.dimension * 5/9, y + this.dimension * 1/10)
//         this.drawingGraphic.lineTo(x + this.dimension * 2/3, y);
//         this.drawingGraphic.lineTo(x + this.dimension * 5/9, y - this.dimension * 1/10)
//
//
//         this.drawingGraphic.lineStyle(5, 0x04b504);
//
//         if ((this.orientation === 0) || (this.orientation === 8)) {
//             this.drawingGraphic.moveTo(x, y);
//             this.drawingGraphic.lineTo(x - this.dimension / 4, y);
//             this.drawingGraphic.moveTo(x + this.dimension, y);
//             this.drawingGraphic.lineTo(x + this.dimension * 5 / 4, y);
//         } else if ((this.orientation === 2) || (this.orientation === 6)) {
//             this.drawingGraphic.moveTo(x, y);
//             this.drawingGraphic.lineTo(x - this.dimension / 4, y);
//             this.drawingGraphic.moveTo(x + this.dimension, y);
//             this.drawingGraphic.lineTo(x + this.dimension * 5 / 4, y);
//         }
//     }
// }
//
//
//
// /////////////////////////////////////////////////////////////////////////////////////////////
// import Cell, {Resistor, VoltageSource, Wire} from './cell.js';
// import Button from "./button.js";
//
// document.body.style.backgroundColor = 'silver';
// // create a new pixi application, all things inside the application must fit within this window
// const app = new PIXI.Application(
//     {
//         width: window.innerWidth,
//         height: window.innerHeight,
//         backgroundColor: 0xFFFFFF,
//         resolution: devicePixelRatio = 5,
//         autoDensity: true,
//     }
// )
// app.ticker.maxFPS = 15;
// app.resize();
//
// // tell the html document to display the pixi application
// document.body.appendChild(app.view)
//
// // constants
// const cell_dimension = 30
// let r_height = (window.innerHeight % cell_dimension)
// let r_width = ((window.innerWidth % cell_dimension))
// const grid_height = ((window.innerHeight - r_height)/ cell_dimension)
// const grid_width = ((window.innerWidth - r_width) / cell_dimension)
// let cell = [];
//
//
// class Board {
//
//     constructor(grid_height, grid_width, cell_dimension) {
//         this.cell = [];
//         this.grid_height = grid_height;
//         this.grid_width = grid_width;
//         this.cell_dimension = cell_dimension;
//         this.fakeResistor = new PIXI.Graphics();
//         this.fakeVoltage  = new PIXI.Graphics();
//         this.fakeWire = new PIXI.Graphics();
//         this.resistor = false;
//         this.voltage = false;
//         this.wire = false;
//
//
//
//
//
//         this.makeFakeResistor();
//         this.makeFakeVoltage();
//         this.makeFakeWire();
//
//     }
//
//     initBoard() {
//         for (let i = 0; i < this.grid_height; i++) {
//
//             this.cell[i] = [];
//         }
// // create a matrix of cells
//         for (let i = 0; i < this.grid_height; i++) {
//             for (let j = 0; j < this.grid_width; j++) {
// // adding the new cell to the array
//                 let newCell = new Cell(j, i, this.cell_dimension, app, this.cell, this)
//                 newCell.draw()
//                 this.cell[i][j] = newCell;
//
//
//             }
//
//
//         }
//     }
//
//
//     connectCells() {
//         for (let i = 0; i < this.grid_height; i++) {
//             for (let j = 0; j < this.grid_width; j++) {
//
// //this.cell[2][2].top = this.cell[1][2];
//                 if (i !== 0) {
//                     this.cell[i][j].top = this.cell[i - 1][j];
//                 }
//
//                 if (j !== 0) {
//                     this.cell[i][j].left = this.cell[i][j - 1];
//                 }
//
//                 if (j < this.grid_width - 1) {
//                     this.cell[i][j].right = this.cell[i][j + 1];
//                 }
//                 if (i < this.grid_height - 1) {
//                     this.cell[i][j].bottom = this.cell[i + 1][j];
//                 }
//
//             }
//         }
//     }
//
//     makeFakeResistor(){
//         //this.resistor = false;
//
//         const xPixels = 1 *30;
//         const yPixels = 2 * 30;
//
//         const dimension = 30;
//
//         const x = xPixels;
//         const y = yPixels + dimension/2
//         this.fakeResistor.interactive = true;
//         this.fakeResistor.dragging = false;
//
//         app.stage.addChild(this.fakeResistor);
//         this.fakeResistor.lineStyle(5, 0x04b504)
//
//         this.fakeResistor.moveTo(x, y);
//         this.fakeResistor.lineTo(x+dimension/10, y)
//         this.fakeResistor.lineTo(x+dimension/5, y - dimension/4)
//         this.fakeResistor.lineTo(x+dimension*2/5, y + dimension/4)
//         this.fakeResistor.lineTo(x+dimension*3/5, y - dimension/4)
//         this.fakeResistor.lineTo(x+dimension*4/5, y + dimension/4)
//         this.fakeResistor.lineTo(x+dimension*9/10, y)
//         this.fakeResistor.lineTo(x+dimension, y)
//
//         console.log("x pson " + this.fakeResistor.x);
//         console.log("y posn" + this.fakeResistor.y);
//
// //hitbox
//         this.fakeResistor.rectangle = new PIXI.Graphics();
//         this.fakeResistor.rectangle.beginFill( 0x04b504)
//         this.fakeResistor.rectangle.drawRect(30, 60, 30, 30);
//         this.fakeResistor.rectangle.interactive = true;
//         this.fakeResistor.rectangle.dragging = false;
//         this.fakeResistor.rectangle.alpha = 0;
//
//         this.fakeResistor.rectangle.endFill();
//
//         app.stage.addChild(this.fakeResistor.rectangle);
//
//     }
//
//     makeFakeVoltage(){
//
//         const xPixels = 1 *30;
//         const yPixels = 3 * 30;
//         const dimension = 30;
//
//         let x = xPixels;
//         let y = yPixels + dimension / 2;
//         this.fakeVoltage.moveTo(x, y);
//         this.fakeVoltage.lineTo(x + dimension / 6, y)
//         this.fakeVoltage.moveTo(x + dimension * 5 / 6, y)
//         this.fakeVoltage.lineTo(x + dimension, y)
//         this.fakeVoltage.drawCircle(x + dimension / 2, y, dimension / (3))
//
//         this.fakeVoltage.lineStyle(2, 0x04b504)
//         //draw plus sign
//         this.fakeVoltage.moveTo(x + dimension * 6 / 12, y)
//         this.fakeVoltage.lineTo(x + dimension * 8 / 12, y)
//         this.fakeVoltage.moveTo(x + dimension * 7 / 12, y - dimension * 1 / 12)
//         this.fakeVoltage.lineTo(x + dimension * 7 / 12, y + dimension * 1 / 12)
//         //draw minus sign
//         this.fakeVoltage.moveTo(x + dimension * 5 / 12, y - dimension * 1 / 12)
//         this.fakeVoltage.lineTo(x + dimension * 5 / 12, y + dimension * 1 / 12)
//
//         this.fakeVoltage.lineStyle(5, 0x04b504);
//
//
//         this.fakeVoltage.moveTo(x, y);
//         this.fakeVoltage.lineTo(x - dimension / 4, y);
//         this.fakeVoltage.moveTo(x + dimension, y);
//         this.fakeVoltage.lineTo(x + dimension * 5 / 4, y);
//
//         app.stage.addChild(this.fakeVoltage);
//         //hitbox
//
//
//         this.fakeVoltage.rectangle = new PIXI.Graphics();
//         this.fakeVoltage.rectangle.beginFill( 0x04b504)
//         this.fakeVoltage.rectangle.drawRect(30, 90, 30, 30);
//         console.log("volt " + this.fakeVoltage.x);
//         console.log("volt" + this.fakeVoltage.y);
//
//         this.fakeVoltage.rectangle.interactive = true;
//         this.fakeVoltage.rectangle.dragging = false;
//         this.fakeVoltage.rectangle.alpha = 0;
//
//         this.fakeVoltage.rectangle.endFill();
//
//         app.stage.addChild(this.fakeVoltage.rectangle);
//
//
//
//     }
//
//     makeFakeWire(){
//         this.fakeWire.beginFill(0x04b504);
//         this.fakeWire.drawRect(30, 130, 30, 5)
//         this.fakeWire.drawCircle(30, 132 , 7);
//         this.fakeWire.drawCircle(60, 132 , 7);
//         this.fakeWire.interactive = true;
//         this.fakeWire.dragging = false;
//         this.fakeWire.endFill();
//
//
//
//         app.stage.addChild(this.fakeWire);
//
//
//
//
//
//     }
// }
//
// /*makeFakeResistor(){
//     const xPixels = 1 *30;
//     const yPixels = 2 * 30;
//
//     const dimension = 30;
//     //const fakeResistor = new PIXI.Graphics();
//     const x = xPixels;
//     const y = yPixels + dimension/2
//     this.fakeResistor.interactive = true;
//     this.fakeResistor.dragging = false;
//
//     app.stage.addChild(this.fakeResistor);
//     this.fakeResistor.lineStyle(5, 0x04b504)
//
//     this.fakeResistor.moveTo(x, y);
//     this.fakeResistor.lineTo(x+dimension/10, y)
//     this.fakeResistor.lineTo(x+dimension/5, y - dimension/4)
//     this.fakeResistor.lineTo(x+dimension*2/5, y + dimension/4)
//     this.fakeResistor.lineTo(x+dimension*3/5, y - dimension/4)
//     this.fakeResistor.lineTo(x+dimension*4/5, y + dimension/4)
//     this.fakeResistor.lineTo(x+dimension*9/10, y)
//     this.fakeResistor.lineTo(x+dimension, y)
//
//
// //hitbox
//     this.fakeResistor.rectangle = new PIXI.Graphics();
//     this.fakeResistor.rectangle.beginFill( 0x04b504)
//     this.fakeResistor.rectangle.drawRect(30, 60, 30, 30);
//     this.fakeResistor.rectangle.interactive = true;
//     this.fakeResistor.rectangle.dragging = false;
//     this.fakeResistor.rectangle.alpha = 0;
//
//     this.fakeResistor.rectangle.endFill();
//
//     app.stage.addChild(this.fakeResistor.rectangle);
//
//
//
//
//
// }*/
//
// console.log(grid_height)
// console.log(grid_width)
// let game = new Board(grid_height, grid_width, cell_dimension);
// game.initBoard(grid_height, grid_width, cell_dimension);
// game.connectCells();
// game.makeFakeResistor();
// game.makeFakeVoltage();
// game.makeFakeWire();
//
//
//
//
//
//
// function onDragStartR(event)
// {
//     // store a reference to the data
//     // the reason for this is because of multitouch
//     // we want to track the movement of this particular touch
//     this.data = event.data;
//     this.alpha = .5;
//     this.dragging = true;
//     game.fakeResistor.data = event.data;
//     game.resistor = true;
//     console.log('onDragStartR called')
//
//
// }
//
// function onDragEndR()
// {
//
//
//
//     this.alpha = .5;
//
//     this.dragging = false;
//
//
//     // set the interaction data to null
//     this.data = null;
//     game.fakeResistor.data = null;
//     game.fakeResistor.x =0;
//     game.fakeResistor.y =0;
//     game.fakeResistor.rectangle.x =0;
//     game.fakeResistor.rectangle.y =0;
//     console.log("onDragEndR called")
//
//
//
//
//
//
// }
//
// function onDragMoveR()
// {
//     if (this.dragging)
//     {
//         this.alpha =.5;
//         var newPosition = this.data.getLocalPosition(this.parent);
//         this.position.x = newPosition.x-50;
//         this.position.y = newPosition.y-50;
//         game.fakeResistor.position.x = newPosition.x-50;
//         game.fakeResistor.position.y = newPosition.y-50;
//
//
//
//     }
// }
//
// function onDragStartV(event)
// {
//     // store a reference to the data
//     // the reason for this is because of multitouch
//     // we want to track the movement of this particular touch
//     this.data = event.data;
//     this.alpha = .5;
//     this.dragging = true;
//     game.fakeVoltage.data = event.data;
//     game.voltage = true;
//
// }
//
// function onDragEndV()
// {
//     this.alpha = .5;
//
//     this.dragging = false;
//
//     // set the interaction data to null
//     this.data = null;
//     game.fakeVoltage.x =0;
//     game.fakeVoltage.y =0;
//     game.fakeVoltage.rectangle.x =0;
//     game.fakeVoltage.rectangle.y =0;
//     game.fakeVoltage.data = null;
//
//
//
// }
//
// function onDragMoveV()
// {
//     if (this.dragging)
//     {
//         this.alpha =.5;
//         var newPosition = this.data.getLocalPosition(this.parent);
//         this.position.x = newPosition.x-50;
//         this.position.y = newPosition.y-80;
//         game.fakeVoltage.position.x = newPosition.x-50;
//         game.fakeVoltage.position.y = newPosition.y-80;
//
//
//
//     }
// }
//
// function onDragStartW(event)
// {
//     // store a reference to the data
//     // the reason for this is because of multitouch
//     // we want to track the movement of this particular touch
//     this.data = event.data;
//     game.wire = true;
//
//
//     this.dragging = true;
//     game.fakeWire.data = event.data;
// }
//
// function onDragEndW()
// {
//
//
//     this.dragging = false;
//     this.position.x = 0;
//     this.position.y = 0;
//
//
//
//
//     // set the interaction data to null
//     this.data = null;
//     game.fakeWire.data = null;
//
// }
//
// function onDragMoveW()
// {
//     if (this.dragging)
//     {
//
//         var newPosition = this.data.getLocalPosition(this.parent);
//         this.position.x = newPosition.x-40;
//         this.position.y = newPosition.y-120;
//
//
//
//
//     }
// }
//
//
//
//
//
//
//
//
//
// game.fakeResistor.rectangle.on('mousedown', onDragStartR);
// game.fakeResistor.rectangle.on('mouseup', onDragEndR);
// game.fakeResistor.rectangle.on('mousemove', onDragMoveR);
// game.fakeResistor.rectangle.on('touchstart', onDragStartR);
// game.fakeResistor.rectangle.on('mouseupoutside', onDragEndR);
// game.fakeResistor.rectangle.on('touchend', onDragEndR);
// game.fakeResistor.rectangle.on('touchendoutside', onDragEndR);
// game.fakeResistor.rectangle.on('touchmove', onDragMoveR);
//
//
// game.fakeVoltage.rectangle.on('mousedown', onDragStartV);
// game.fakeVoltage.rectangle.on('mouseup', onDragEndV);
// game.fakeVoltage.rectangle.on('mousemove', onDragMoveV);
// game.fakeVoltage.rectangle.on('touchstart', onDragStartV);
// game.fakeVoltage.rectangle.on('mouseupoutside', onDragEndV);
// game.fakeVoltage.rectangle.on('touchend', onDragEndV);
// game.fakeVoltage.rectangle.on('touchendoutside', onDragEndV);
// game.fakeVoltage.rectangle.on('touchmove', onDragMoveV);
//
// game.fakeWire.on('mousedown', onDragStartW);
// game.fakeWire.on('mouseup', onDragEndW);
// game.fakeWire.on('mousemove', onDragMoveW);
// game.fakeWire.on('touchstart', onDragStartW);
// game.fakeWire.on('mouseupoutside', onDragEndW);
// game.fakeWire.on('touchend', onDragEndW);
// game.fakeWire.on('touchendoutside', onDragEndW);
// game.fakeWire.on('touchmove', onDragMoveW);
//
//
//
// let testButton = new Button(10, window.innerHeight - 80, 100, 50, app, cell)
// testButton.draw()
//
// // let graph = new PIXI.Graphics
// //
// // graph.beginFill(0x04b504)
// // graph.drawRect(this.locationx, this.locationy, this.sizex, this.sizey)
// // graph.endFill()
// // graph.addChild(this.graphic)
//
//
//