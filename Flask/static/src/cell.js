import Reference from "./Reference.js";

export default class Cell {
    constructor(x_coordinate, y_coordinate, dimension, app, matrix, board) {
        this.graphic = new PIXI.Graphics; //Container for the graphics of each cell
        this.drawingGraphic = new PIXI.Graphics;
        this.app = app; //pixi application
        this.x = x_coordinate; //index coordinates of the cell
        this.y = y_coordinate;
        this.dimension = dimension; // size of the cell
        this.graphic.interactive = true; // make a button
        this.graphic.buttonMode = true;
        this.graphic.on('click', () => this.onClick()) //run the onClick method when clicked
        this.graphic.on('rightdown', () => this.onRightClick());
        this.graphic.on('mouseup', () => this.onMouseUp())
        this.graphic.on('touchend', () => this.onMouseUp())
        this.graphic.on('touchendoutside', () => this.onMouseUp())
        this.graphic.on('mouseupoutside', () => this.onMouseUp())

        this.voltage = null
        this.volttext = new PIXI.Text('', {fontFamily : 'Arial', fontSize: 10, fill : 0x04b504, align : 'center'});
        this.current = null
        this.amptext = new PIXI.Text('', {fontFamily : 'Arial', fontSize: 10, fill : 0x04b504, align : 'center'});
        this.arrowGraph = new PIXI.Graphics

        this.netitem = null
        this.reference = null

        this.xpixels = this.x * this.dimension; // pixel coordinates of the cell
        this.ypixels = this.y * this.dimension;
        this.matrix = matrix; //external matrix of the cell
        this.connected_parts = new Set();
        this.graphic.on('mouseover', () => this.onHover());
        this.type = 'Cell'
        this.text = new PIXI.Text('', {fontFamily : 'Arial', fontSize: 10, fill : 0x04b504, align : 'center'});

        this.board = board;

        this.top = null;
        this.bottom = null;
        this.right = null;
        this.left = null;

    }

    connect(part) { //connect two adjacent wires
        /**
         * connect two wires both in the graph and visually
         */
        //add to graph
        this.connected_parts.add(part);
        part.connected_parts.add(this);
        //display in the correct direction
        let direction = this.find_direction(part);
        this.display_orient(direction)
        part.display_orient(this.reverse_direction(direction))

    }

    display_orient(direction) {
        //this function does nothing unless overridden by a subclass
    }

    disconnect(part) {
        /**
         * disconnects two parts from each other
         * @param {Wire, Component} part connected part meant to be disconnected
         */
        this.connected_parts.delete(part);
        part.connected_parts.delete(this);
        let direction = this.find_direction(part);
        this.undisplay(direction);
        part.undisplay(this.reverse_direction(direction));
    }

    undisplay(direction) {
        /**
         * this function is designed to be overridden, the opposite of the display_orient method
         * @param {number} direction integer 1-4 NESW
         */
        alert('Called \' undisplay \' method on an empty cell')
    }

    reverse_direction(dir) {
        /**
         * finds the reversed direction of the input given
         * @type {number}
         */
        let reverse;
        if (dir === 1) {
            reverse = 3
        } else if (dir ===2) {
            reverse = 4
        } else if (dir ===3) {
            reverse = 1
        } else if (dir === 4) {
            reverse = 2
        }
        return (reverse);
    }

    find_direction(part) {
        /**
         * returns the direction
         * @type {Wire, Component}
         */
        let x_diff = part.x - this.x; //find the direction which the cell is in
        let y_diff = part.y - this.y;
        let direction;
        // direction system has 1 up, 2, right, 3 down, 4 left
        if ((x_diff !== 0) || (y_diff !== 0)) {
            if (x_diff === 1) {
                direction = 2
            } else if (x_diff === -1) {
                direction = 4
            } else if (y_diff === -1) {
                direction = 1
            } else if (y_diff === 1) {
                direction = 3
            }
        } else {
            return null
        }

        return direction
    }

    find_space() {
        try {
            const [connected] = this.connected_parts
            let direction = this.find_direction(connected)
            return ((direction % 2) + 1) // display on either the right or above
        } catch(TypeError) {
            return null
        }
    }

    draw() {
        /**
         * draws the cell that backgrounds the components
         */
        this.graphic.clear() // destroy any current lines draw on
        this.graphic.lineStyle(2, 0x2A2B2C, 1) // set lines which border cells and become the grid
        this.graphic.beginFill(0x000000) //fill with black
        this.graphic.drawRect(this.xpixels, this.ypixels, this.dimension, this.dimension) //create square
        this.graphic.endFill()
        this.app.stage.addChild(this.graphic) //stage this graphic
        // console.log('drawing', this.x, this.y)
    }

    onClick() {
        /**
         * onClick method for all cells, wires, and components
         */
        // console.log('onclick')
        if(this.board.erased === true) {
            this.makePart('Cell');
            // console.log(this.board.erased)
        }
            else {


            if (this instanceof Wire) {
                this.makePart('Resistor');
            } else if (this instanceof Resistor) {
                this.makePart('VoltageSource');
            } else if (this instanceof VoltageSource) {
                this.makePart('CurrentSource');
            } else {
                this.makePart('Wire')
            }
        }

    // console.log('onclick2')
        // console.log(this.board.erased);

        // console.log('onClick running')
    }

    onRightClick() {
        /**
         * onClick method for all cells, wires, and components
         */
        // console.log('right click ran')

        if(this instanceof Resistor) {
            this.makePart('VoltageSource');
        } else {
            this.makePart('Resistor')
        }
        // console.log('onClick running')
    }

    rerender() {
        // console.log('running rerender')
        /**
         * rerender surrounding parts ensuring everything is up to date
         */

        if((this.top instanceof Wire) || (this.top instanceof Component) ){
            this.top.render();
        }

        if((this.bottom instanceof Wire) || (this.bottom instanceof Component) ){
            this.bottom.render();
        }
        if((this.right instanceof Wire) || (this.right instanceof Component) ){
            this.right.render();
        }
        if((this.left instanceof Wire) || (this.left instanceof Component) ){
            this.left.render();
        }


        }


    makePart(part) {
        /**
         * forms a new part in place of whatever was currently present
         */
        //console.log(this.x, this.y, this.top.x, this.top.y)
        // console.log('running makePart')
        if ((this instanceof Wire) || (this instanceof Component)) {
            this.drawingGraphic.clear()
            if (this instanceof Component) {
                this.text.destroy()
            }
        }

        let newPart;
        if(part === 'Wire') {
            newPart = new Wire(this.x, this.y, this.dimension, this.app, this.matrix, this.board); // new wire object with same properties as the cell
        }
        else if(part === 'Resistor') {
            newPart = new Resistor(this.x, this.y, this.dimension, this.app, this.matrix, 15, this.board);
        }
        else if(part === 'VoltageSource') {
            newPart = new VoltageSource(this.x, this.y, this.dimension, this.app, this.matrix, 15, this.board);
        } else if(part === 'CurrentSource') {
            newPart = new CurrentSource(this.x, this.y, this.dimension, this.app, this.matrix, 15, this.board);
        }
        else if(part === 'Cell'){
            newPart = new Cell(this.x, this.y, this.dimension, this.app, this.matrix, this.board);
        } else {
            alert('Input non valid circuit part')
        }
        this.matrix[this.y][this.x] = newPart; // set the matrix coordinates to the new object
        // newPart.draw()

        newPart.top = this.top;
        newPart.bottom = this.bottom;
        newPart.left = this.left;
        newPart.right = this.right;
        //update parts connections


        this.connected_parts.forEach(part => {
            this.disconnect(part)
            newPart.connect(part)
        })

        if(this.top !== null){
            // console.log('update bottom running')
            this.top.updateBottom(newPart);
        }
        if(this.bottom !== null){
            this.bottom.updateTop(newPart);
        }
        if(this.right !== null){
            this.right.updateLeft(newPart);
        }
        if(this.left !== null){
            this.left.updateRight(newPart);
        }
        if((this.top instanceof Wire) || (this.top instanceof Component)) {
            newPart.connect(this.top);
            if (this.top instanceof Wire) {
                this.top.render();
            }
            if (this.top instanceof Component) {
                this.top.refresh();
            }
        }
        if((this.bottom instanceof Wire) || (this.bottom instanceof Component)) {
            newPart.connect(this.bottom);
            if (this.bottom instanceof Wire) {
                this.bottom.render();
            }
            if (this.bottom instanceof Component) {
                this.bottom.refresh();
            }
        }

        if((this.right instanceof Wire) || (this.right instanceof Component)) {
            newPart.connect(this.right);
            if (this.right instanceof Wire) {
                this.right.render();
            }
            if (this.right instanceof Component) {
                this.right.refresh();
            }
        }

        if((this.left instanceof Wire) || (this.left instanceof Component)) {
            newPart.connect(this.left);
            if (this.left instanceof Wire) {
                this.left.render();
            }
            if (this.left instanceof Component) {
                this.left.refresh();
            }
        }
        newPart.draw()



        if(newPart instanceof Wire || newPart instanceof Component){
            newPart.render(); //draw wire
            newPart.rerender();
        }


        delete this // delete the original cell object

    }


    onHover() {
        // if (this.mouseDown) {
        //     this.makePart('Wire')
        //     console.log('hi')
        // }
    }

    onMouseUp(){
        if(this.board.resistor === true){
            this.bottom.makePart('Resistor')
            this.board.resistor = false;

        }

        if(this.board.wire === true){
            this.makePart('Wire')
            this.board.wire = false;
        }
        if(this.board.voltage === true){
            this.bottom.makePart('VoltageSource')
            this.board.voltage = false;

        }
    }

    updateBottom(part){
        this.bottom = part;

    }

    updateTop(part){
        this.top = part;
    }

    updateLeft(part){
        this.left = part;

    }

    updateRight(part){
        this.right = part;
    }



    render_current() {
        console.log('rendering current...')
        this.amptext.destroy()
        // let space = this.find_space()
        let dispcurrent = Math.abs(Math.round(parseFloat(this.current) * 1000) / 1000).toString()
        this.amptext = new PIXI.Text(dispcurrent + ' A', {fontFamily : 'Arial', fontSize: 10, fill : 0x04b504, align : 'center'});
        let dir = this.draw_arrow()

        if (dir % 2 === 0) {
            this.amptext.x = this.xpixels + this.dimension * 1/5
            this.amptext.y = this.ypixels - this.dimension * 2/5
        } else {
            this.amptext.x = this.xpixels - this.dimension * 2/5
            this.amptext.y = this.ypixels - this.dimension * 1/10
        }


        this.app.stage.addChild(this.amptext)


    }

    draw_arrow() {
        console.log('drawing arrow')
        this.arrowGraph.destroy()
        this.arrowGraph = new PIXI.Graphics
        this.arrowGraph.lineStyle(this.dimension/20, 0x04b504)
        //draw an arrow in the correct direction
        // for a connected direction
        let seen = new Set()
        const [check_direction] = this.connected_parts
        seen.add(this)
        // go until finding a node/component reference


        let direction_override = false
        let checking = check_direction
        while (checking.reference === null) {
            seen.add(checking)
            checking.connected_parts.forEach(connected => {
                if (!(seen.has(connected))) {
                    checking = connected
                }
            })
            if ((checking instanceof Component) && (this.reference !== null)) {
                if (checking.netitem.node1 === this.netitem.node2) {
                    console.log('checking nodes...')
                    direction_override = true
                    break
                }
            }
        }
        console.log('evaluating at node', checking.x, checking.y)
        // console.log(checking.x, checking.y)
        // check if that reference is node 1 or node 2 according to this.netitem
        let direction = this.find_direction(check_direction)
        console.log('running at cell', this.x, this.y)
        console.log('node in this direction direction:', direction)
        console.log('node at:', check_direction.x, check_direction.y)

        //draw the line that will become the arrow

        if (direction % 2 === 0) {
            // display a horizontal bar above
            this.arrowGraph.moveTo(this.xpixels + this.dimension/5, this.ypixels - this.dimension/10)
            this.arrowGraph.lineTo(this.xpixels + this.dimension*4/5, this.ypixels - this.dimension/10)
        } else {
            // display a vertical bar
            this.arrowGraph.moveTo(this.xpixels - this.dimension/10, this.ypixels + this.dimension/5)
            this.arrowGraph.lineTo(this.xpixels - this.dimension/10, this.ypixels + this.dimension*4/5)
        }
        let display_arrow_dir;
        // if that direction is equal to the node 2 direction XOR the current is negative, then display the arrow in the node 2 direction


        let floatCurrent = parseFloat(this.current)
        console.log(this.netitem.node2 === checking.reference, floatCurrent < 0)

        if (((this.netitem.node2 === checking.reference) && (!(floatCurrent < 0))) || ((!(this.netitem.node2 === checking.reference)) && (floatCurrent < 0))) {
            console.log('XOR!')
            display_arrow_dir = direction
        } else { //display the arrow in the node 1 direction, the reverse of direction
            console.log('reversing directions...')
            display_arrow_dir = this.reverse_direction(direction)
        }

        if (direction_override) {
            console.log('overriding...')
            display_arrow_dir = this.reverse_direction(direction)
        }

        console.log('display arrow at', display_arrow_dir)

        if (display_arrow_dir === 1) {
            this.arrowGraph.moveTo(this.xpixels - this.dimension*2/10, this.ypixels + this.dimension * 3/10)
            this.arrowGraph.lineTo(this.xpixels - this.dimension/10, this.ypixels + this.dimension*1/5)
            this.arrowGraph.lineTo(this.xpixels, this.ypixels + this.dimension * 3/10)
        } else if (display_arrow_dir === 2 ) {
            this.arrowGraph.moveTo(this.xpixels + this.dimension*7/10, this.ypixels - this.dimension*2/10)
            this.arrowGraph.lineTo(this.xpixels + this.dimension*4/5, this.ypixels - this.dimension/10)
            this.arrowGraph.lineTo(this.xpixels + this.dimension*7/10, this.ypixels)
        } else if (display_arrow_dir === 3 ) {
            this.arrowGraph.moveTo(this.xpixels - this.dimension*2/10, this.ypixels + this.dimension* 7/10)
            this.arrowGraph.lineTo(this.xpixels - this.dimension/10, this.ypixels + this.dimension*4/5)
            this.arrowGraph.lineTo(this.xpixels, this.ypixels + this.dimension* 7/10)
        } else if (display_arrow_dir === 4 ) {
            this.arrowGraph.moveTo(this.xpixels + this.dimension*3/10, this.ypixels - this.dimension*2/10)
            this.arrowGraph.lineTo(this.xpixels + this.dimension*1/5, this.ypixels - this.dimension/10)
            this.arrowGraph.lineTo(this.xpixels + this.dimension*3/10, this.ypixels)
        }
        this.app.stage.addChild(this.arrowGraph)
        return display_arrow_dir
    }

    render_voltage() {
        //render the given voltage of a cell
        console.log('rendering voltage...')
        this.volttext.destroy()

        let dispvoltage = ((Math.round(parseFloat(this.voltage) * 1000)) / 1000).toString()
        this.volttext = new PIXI.Text(dispvoltage + ' V', {fontFamily : 'Arial', fontSize: 10, fill : 0x04b504, align : 'center'});
        if (this instanceof Component) {
            this.volttext.x = this.xpixels - this.dimension*3/10
            this.volttext.y = this.ypixels - this.dimension/5
        } else {
            this.volttext.x = this.xpixels
            this.volttext.y = this.ypixels - this.dimension * 1/10
        }
        this.app.stage.addChild(this.volttext)

    }
}


export class Wire extends Cell {
    /**
     * Circuit Wires
     * @param x_coordinate position in matrix
     * @param y_coordinate
     * @param dimension pixel dimension of the cell
     * @param app PIXI application
     * @param matrix matrix holding the cell
     */
    constructor(x_coordinate, y_coordinate, dimension, app, matrix, board) {
        super(x_coordinate, y_coordinate, dimension, app, matrix, board);
        this.display_directions = new Set();
        this.type = 'Wire'
    }

    display_orient(direction) {
        /**
         * adds direction to the set of directions needed to display
         * @type {number}
         */
        this.display_directions.add(direction)
    }




    undisplay(direction) {
        /**
         * removes a direction from the display
         * @type {number}
         */
        this.display_directions.delete(direction)
    }

    create_node(size) {
        /**
         * draw a circle of different sizes in the middle of a cell
         * @param {number} size in pixels
         */
        this.drawingGraphic.beginFill(0x04b504);
        this.drawingGraphic.drawCircle(this.xpixels + this.dimension/2, this.ypixels + this.dimension/2, size);
        this.drawingGraphic.endFill();
        this.app.stage.addChild(this.drawingGraphic);
    }

    render() {
        /**
         * recreate the way the object looks on screen
         */
        // console.log('running render')
        this.drawingGraphic.clear()
        // this.graphic = new PIXI.Graphics // recreate the item
        if ((this.display_directions.size !== 2)) { //if you want to see a big circle
            this.create_node(this.dimension / 4); // create a big node
        } else {
            this.create_node(this.dimension / 15); //create a small node
        }
        this.draw_a_wire();
        // console.log(this.x, this.y, this.display_directions, this.connected_parts.size)
        // console.log(this.connected_parts);
    }


    draw_a_wire() {
        /**
         * actually draw a wire
         */
        // this.graphic.lineStyle.re
        // this.drawingGraphic.clear()
        this.drawingGraphic.lineStyle(this.dimension/7, 0x04b504); // change the linestyle to thick green
        this.display_directions.forEach(dir => {
            let y_change;
            let x_change;
            if (dir % 2 === 0) {
                y_change = 0
                if (dir === 2) {
                    x_change = 1
                } else {
                    x_change = -1
                }
            } else {
                x_change = 0
                if (dir === 3) {
                    y_change = 1
                } else {
                    y_change = -1
                }
            }
            let x_location = this.xpixels + this.dimension / 2; //center on the cell
            let y_location = this.ypixels + this.dimension / 2;
            this.drawingGraphic.moveTo(x_location, y_location); // move to center of cell
            x_change = ((x_change * this.dimension))/2
            y_change = ((y_change * this.dimension))/2
            this.drawingGraphic.lineTo(x_location + x_change, y_location + y_change);
            this.app.stage.addChild(this.drawingGraphic);
        });
    }
}



export class Component extends Cell {
    /**
     * Component subclass of cell containing subclasses for resistors, voltage sources etc.
     * @param x_coordinate
     * @param y_coordinate
     * @param dimension
     * @param app
     * @param matrix
     */
    constructor(x_coordinate, y_coordinate, dimension, app, matrix, board) {
        super(x_coordinate, y_coordinate, dimension, app, matrix, board);
        this.orientation = null;
        this.unit = ''
        // this.text = null;
        this.type = 'Component'
        this.drawingGraphic.on('rightdown', () => this.onRightClick())
    }

    display_orient(direction) {
        /**
         * change the orientation to a direction
         */
        this.orientation = direction;
    }

    undisplay(direction) {
        /**
         * not needed for components
         */
    }


    rotate() {
        /**
         * rotate the graphic depending on orientation
         */
        //set pivot point to the middle
        this.drawingGraphic.x = this.xpixels + this.dimension / 2;
        this.drawingGraphic.y = this.ypixels + this.dimension / 2;
        this.drawingGraphic.pivot.x = this.drawingGraphic.x
        this.drawingGraphic.pivot.y = this.drawingGraphic.y;
        if (this.orientation === null) {
            this.drawingGraphic.rotation = 0;
        } else {
            this.drawingGraphic.rotation = 3.1415/2 * this.orientation
        }
        // } else if ((this.orientation === 0) || (this.orientation === 8)) {
        //     this.drawingGraphic.rotation = 5 * 3.1415 / 4
        // } else if ((this.orientation === 2) || (this.orientation === 6)) {
        //     this.drawingGraphic.rotation = 5 * 3.1415 * 3 / 4;
    }

    onRightClick() {
        if (this.orientation === null) {
            this.orientation = 1;
        }
        this.orientation += 1;
        if (this.orientation > 4) {
            this.orientation = 1
        }
        this.rotate()
        this.refresh()
        this.render()
    }

    refresh() {
        // console.log('running refresh')
        let list = [this.left, this.right, this.top, this.bottom]
        for (let i = 0; i < list.length; i++) {
            let part = list[i]
            if ((part instanceof Wire) || (part instanceof Component)) { //if adjacent objects are a wire
                let dir = this.find_direction(part)
                if ((dir === this.orientation) || (this.reverse_direction(dir) === this.orientation)) {
                    this.connect(part)
                    // console.log('connected in refresh')
                } else {
                    this.disconnect(part) // connect this wire with adjacent wires
                }
                if (part instanceof Wire) {
                    part.render();
                }
            }
        }
    }

    render_value() {
        /**
         * render the text object that displays the value of the resistor
         */
        this.text.destroy()
        let space = this.find_space()
        this.text = new PIXI.Text(this.value.toString() + ' ' + this.unit, {fontFamily : 'Arial', fontSize: 10, fill : 0x04b504, align : 'center'});
        if (space === 2) {
            //display text to the right
            this.text.x = this.xpixels + (this.dimension)
            this.text.y = this.ypixels + this.dimension*2/5
        } else if ((space === 1) || (space === null)) {
            // display text below
            this.text.x = this.xpixels + this.dimension * 1/10
            this.text.y = this.ypixels + this.dimension * 5/5
        }

        this.app.stage.addChild(this.text)

        // this.text.interactive = true;
        // this.text.buttonMode = true;
        // this.text.on('pointerdown', () => this.onTextClick())
        // this.drawingGraphic.addChild(this.text);

    }


    onTextClick() {
        // console.log('clicking text')
        // if(this.board.erased === true){
        //     this.text.destroy();

        // }
    }

}

export class Resistor extends Component {
    /**
     * Resistor component
     * @param x_coordinate
     * @param y_coordinate
     * @param dimension
     * @param app
     * @param matrix
     * @param value
     */
    constructor(x_coordinate, y_coordinate, dimension, app, matrix, value, board) {
        super(x_coordinate, y_coordinate, dimension, app, matrix, board);
        this.value = value;
        this.unit = 'Ω';
        this.abbr = 'R'
    }

    render() {
        /**
         * render method for resistor!
         */
        // this.graphic.clear() // destroy any current lines draw on
        // this.graphic = new PIXI.Graphics // recreate the item
        this.drawingGraphic.clear()
        this.app.stage.addChild(this.drawingGraphic);
        this.drawingGraphic.lineStyle(this.dimension/7, 0x04b504); // change the linestyle to thick green

        this.draw_a_resistor()
        this.rotate()
        this.refresh()

        this.render_value()
        // console.log(this.connected_parts);
    }

    draw_a_resistor() {
        /**
         * Creates the PIXI graphic for a resistor
         */
        let x = this.xpixels;
        let y = this.ypixels + this.dimension/2;
        this.drawingGraphic.moveTo(x, y);
        this.drawingGraphic.lineTo(x+this.dimension/10, y)
        this.drawingGraphic.lineTo(x+this.dimension/5, y - this.dimension/4)
        this.drawingGraphic.lineTo(x+this.dimension*2/5, y + this.dimension/4)
        this.drawingGraphic.lineTo(x+this.dimension*3/5, y - this.dimension/4)
        this.drawingGraphic.lineTo(x+this.dimension*4/5, y + this.dimension/4)
        this.drawingGraphic.lineTo(x+this.dimension*9/10, y)
        this.drawingGraphic.lineTo(x+this.dimension, y)


    }

}


export class VoltageSource extends Component {
    /**
     * Voltage Source Component
     * @param x_coordinate
     * @param y_coordinate
     * @param dimension
     * @param app
     * @param matrix
     * @param value
     */
    constructor(x_coordinate, y_coordinate, dimension, app, matrix, value, board) {
        super(x_coordinate, y_coordinate, dimension, app, matrix, board);
        this.value = value;
        this.unit = 'V';
        this.abbr = 'V'
        // this.text = null;
    }

    render() {
        /**
         * delete old graphic and draw a new voltage source in correct orientation
         */
        // this.graphic.destroy() // destroy any current lines draw on
        // this.graphic = new PIXI.Graphics // recreate the item
        this.drawingGraphic.clear()
        this.app.stage.addChild(this.drawingGraphic);
        this.drawingGraphic.lineStyle(this.dimension/7, 0x04b504); // change the linestyle to thick green

        this.draw_a_voltagesource();
        this.rotate()

        this.refresh()
        this.render_value()
        // console.log(this.connected_parts);
    }

    draw_a_voltagesource() {
        /**
         * PIXI drawing of voltage source
         */
        let x = this.xpixels;
        let y = this.ypixels + this.dimension / 2;
        this.drawingGraphic.moveTo(x, y);
        this.drawingGraphic.lineTo(x + this.dimension / 6, y)
        this.drawingGraphic.moveTo(x + this.dimension * 5 / 6, y)
        this.drawingGraphic.lineTo(x + this.dimension, y)
        this.drawingGraphic.drawCircle(x + this.dimension / 2, y, this.dimension / (3))

        this.drawingGraphic.lineStyle(2, 0x04b504)
        //draw plus sign
        this.drawingGraphic.moveTo(x + this.dimension * 6 / 12, y)
        this.drawingGraphic.lineTo(x + this.dimension * 8 / 12, y)
        this.drawingGraphic.moveTo(x + this.dimension * 7 / 12, y - this.dimension * 1 / 12)
        this.drawingGraphic.lineTo(x + this.dimension * 7 / 12, y + this.dimension * 1 / 12)
        //draw minus sign
        this.drawingGraphic.moveTo(x + this.dimension * 5 / 12, y - this.dimension * 1 / 12)
        this.drawingGraphic.lineTo(x + this.dimension * 5 / 12, y + this.dimension * 1 / 12)

        this.drawingGraphic.lineStyle(this.dimension/7, 0x04b504);


    }
}



export class CurrentSource extends Component {
    /**
     * Voltage Source Component
     * @param x_coordinate
     * @param y_coordinate
     * @param dimension
     * @param app
     * @param matrix
     * @param value
     */
    constructor(x_coordinate, y_coordinate, dimension, app, matrix, value, board) {
        super(x_coordinate, y_coordinate, dimension, app, matrix, board);
        this.value = value;
        this.unit = 'A';
        this.abbr = 'I'
        // this.text = null;
    }

    render() {
        /**
         * delete old graphic and draw a new voltage source in correct orientation
         */
        // this.graphic.destroy() // destroy any current lines draw on
        // this.graphic = new PIXI.Graphics // recreate the item
        this.drawingGraphic.clear()
        this.app.stage.addChild(this.drawingGraphic);
        this.drawingGraphic.lineStyle(this.dimension/7, 0x04b504); // change the linestyle to thick green

        this.draw_a_currentsource();
        this.rotate()

        this.refresh()
        this.render_value()
        // console.log(this.connected_parts);
    }

    draw_a_currentsource() {
        /**
         * PIXI drawing of voltage source
         */
        let x = this.xpixels;
        let y = this.ypixels + this.dimension / 2;
        this.drawingGraphic.moveTo(x, y);
        this.drawingGraphic.lineTo(x + this.dimension / 6, y)
        this.drawingGraphic.moveTo(x + this.dimension * 5 / 6, y)
        this.drawingGraphic.lineTo(x + this.dimension, y)
        this.drawingGraphic.drawCircle(x + this.dimension / 2, y, this.dimension / (3))

        this.drawingGraphic.lineStyle(2, 0x04b504)
        //draw plus sign
        this.drawingGraphic.moveTo(x + this.dimension *  1/3, y)
        this.drawingGraphic.lineTo(x + this.dimension * 2/3, y)
        this.drawingGraphic.moveTo(x + this.dimension * 5/9, y + this.dimension * 1/10)
        this.drawingGraphic.lineTo(x + this.dimension * 2/3, y);
        this.drawingGraphic.lineTo(x + this.dimension * 5/9, y - this.dimension * 1/10)


        this.drawingGraphic.lineStyle(this.dimension/7, 0x04b504);

    }
}