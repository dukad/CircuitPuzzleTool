import Cell from './cell.js'


export default class Board {

    constructor(grid_height, grid_width, cell_dimension, app) {
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
        this.app = app;


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
                let newCell = new Cell(j, i, this.cell_dimension, this.app, this.cell, this)
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
        bar.beginFill(0x3A3B3C)
        bar.drawRoundedRect(17, 20 , 60, 140)
        bar.endFill();
        bar.interactive = true

        this.app.stage.addChild(bar);

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

        this.app.stage.addChild(this.fakeResistor);
        this.fakeResistor.lineStyle(5, 0x04b504)

        this.fakeResistor.moveTo(x, y);
        this.fakeResistor.lineTo(x+dimension/10, y)
        this.fakeResistor.lineTo(x+dimension/5, y - dimension/4)
        this.fakeResistor.lineTo(x+dimension*2/5, y + dimension/4)
        this.fakeResistor.lineTo(x+dimension*3/5, y - dimension/4)
        this.fakeResistor.lineTo(x+dimension*4/5, y + dimension/4)
        this.fakeResistor.lineTo(x+dimension*9/10, y)
        this.fakeResistor.lineTo(x+dimension, y)

        // console.log("x pson " + this.fakeResistor.x);
        // console.log("y posn" + this.fakeResistor.y);

//hitbox
        this.fakeResistor.rectangle = new PIXI.Graphics();
        this.fakeResistor.rectangle.beginFill( 0x04b504)
        this.fakeResistor.rectangle.drawRect(30, 60, 30, 30);
        this.fakeResistor.rectangle.interactive = true;
        this.fakeResistor.rectangle.dragging = false;
        this.fakeResistor.rectangle.alpha = 0;

        this.fakeResistor.rectangle.endFill();

        this.app.stage.addChild(this.fakeResistor.rectangle);

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

        this.app.stage.addChild(this.fakeVoltage);
        //hitbox


        this.fakeVoltage.rectangle = new PIXI.Graphics();
        this.fakeVoltage.rectangle.beginFill( 0x04b504)
        this.fakeVoltage.rectangle.drawRect(30, 90, 30, 30);
        // console.log("volt " + this.fakeVoltage.x);
        // console.log("volt" + this.fakeVoltage.y);

        this.fakeVoltage.rectangle.interactive = true;
        this.fakeVoltage.rectangle.dragging = false;
        this.fakeVoltage.rectangle.alpha = 0;

        this.fakeVoltage.rectangle.endFill();

        this.app.stage.addChild(this.fakeVoltage.rectangle);



    }

    makeFakeWire(){
        this.fakeWire.beginFill(0x04b504);
        this.fakeWire.drawRect(30, 130, 30, 5)
        this.fakeWire.drawCircle(30, 132 , 7);
        this.fakeWire.drawCircle(60, 132 , 7);
        this.fakeWire.interactive = true;
        this.fakeWire.dragging = false;
        this.fakeWire.endFill();



        this.app.stage.addChild(this.fakeWire);





    }

    makeEraser(){

        this.eraser = new PIXI.Text('Eraser', {fontFamily : 'Arial', fontSize: 18, fill :0x04b504, align : 'center' });
        this.eraser.x = 20;
        this.eraser.y = 35;
        this.eraser.interactive = true;


        this.app.stage.addChild(this.eraser);
    }
}
