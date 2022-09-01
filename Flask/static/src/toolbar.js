export default class Toolbar {
    constructor(app, list, dimension) {
        this.app = app
        this.list = list
        this.dimension = dimension
        this.bar = new PIXI.Graphics()

        this.fakeResistor = new PIXI.Graphics
        this.fakeVoltage = new PIXI.Graphics
        this.fakeWire = new PIXI.Graphics

        this.height = this.list.length * this.dimension
        this.width = this.dimension * 9/5
        this.drawBar()

        this.color = 0x3A3B3C
    }

    create() {
        this.drawBar()
        this.drawComponents()
    }

    drawBar() {
        console.log('running draw bar')
        this.bar.clear()
        this.bar.beginFill(this.color)
        this.bar.drawRoundedRect(this.dimension/10, this.dimension/10 , this.width, this.height)
        this.bar.endFill();
        this.bar.interactive = true
        this.app.stage.addChild(this.bar);

    }

    drawComponents() {
        let y = this.dimension/2
        for (let i = 0; i < this.list.length; i++) {
            let element = this.list[i]
            if (element === 'Eraser') {
                this.makeEraser(this.dimension/2, y)
            } else if (element === 'Wire') {
                this.makeFakeWire(this.dimension/2, y)
            } else if (element === 'Resistor') {
                this.makeFakeResistor(this.dimension/2, y)
            } else if (element === 'VoltageSource') {
                this.makeFakeVoltage(this.dimension/2, y)
            } else if (element === 'CurrentSource') {
                this.makeCurrentSource(this.dimension/2, y)
            }
            y += this.dimension
        }
    }

    makeFakeResistor(x, y){
        this.fakeResistor.clear()
        this.fakeResistor.interactive = true;
        this.fakeResistor.dragging = false;

        this.fakeResistor.lineStyle(5, 0x04b504)
        this.fakeResistor.moveTo(x, y);
        this.fakeResistor.lineTo(x+this.dimension/10, y)
        this.fakeResistor.lineTo(x+this.dimension/5, y - this.dimension/4)
        this.fakeResistor.lineTo(x+this.dimension*2/5, y + this.dimension/4)
        this.fakeResistor.lineTo(x+this.dimension*3/5, y - this.dimension/4)
        this.fakeResistor.lineTo(x+this.dimension*4/5, y + this.dimension/4)
        this.fakeResistor.lineTo(x+this.dimension*9/10, y)
        this.fakeResistor.lineTo(x+this.dimension, y)


        this.fakeResistor.rectangle = new PIXI.Graphics();
        this.fakeResistor.rectangle.beginFill( 0x04b504)
        this.fakeResistor.rectangle.drawRect(x, y, this.dimension, this.dimension);

        this.fakeResistor.rectangle.interactive = true;
        this.fakeResistor.rectangle.dragging = false;
        this.fakeResistor.rectangle.alpha = 0;

        this.fakeResistor.rectangle.endFill();

        this.app.stage.addChild(this.fakeResistor);
        this.app.stage.addChild(this.fakeResistor.rectangle);

    }

    makeFakeVoltage(x, y){
        this.fakeVoltage.lineStyle(5, 0x04b504);
        this.fakeVoltage.moveTo(x, y);
        this.fakeVoltage.lineTo(x + this.dimension / 6, y)
        this.fakeVoltage.moveTo(x + this.dimension * 5 / 6, y)
        this.fakeVoltage.lineTo(x + this.dimension, y)
        this.fakeVoltage.drawCircle(x + this.dimension / 2, y, this.dimension/3)


        // this.fakeVoltage.drawCircle()
        this.fakeVoltage.lineStyle(2, 0x04b504)
        //draw plus sign
        this.fakeVoltage.moveTo(x + this.dimension * 6 / 12, y)
        this.fakeVoltage.lineTo(x + this.dimension * 8 / 12, y)
        this.fakeVoltage.moveTo(x + this.dimension * 7 / 12, y - this.dimension * 1 / 12)
        this.fakeVoltage.lineTo(x + this.dimension * 7 / 12, y + this.dimension * 1 / 12)
        //draw minus sign
        this.fakeVoltage.moveTo(x + this.dimension * 5 / 12, y - this.dimension * 1 / 12)
        this.fakeVoltage.lineTo(x + this.dimension * 5 / 12, y + this.dimension * 1 / 12)

        this.app.stage.addChild(this.fakeVoltage);

        this.fakeVoltage.rectangle = new PIXI.Graphics();
        this.fakeVoltage.rectangle.beginFill(0x04b504)
        this.fakeVoltage.rectangle.drawRect(x, y, this.dimension, this.dimension);

        this.fakeVoltage.rectangle.interactive = true;
        this.fakeVoltage.rectangle.dragging = false;
        this.fakeVoltage.rectangle.alpha = 0;

        this.fakeVoltage.rectangle.endFill();

        this.app.stage.addChild(this.fakeVoltage.rectangle);
    }

    makeFakeWire(x, y){
        this.fakeWire.beginFill(0x04b504);
        this.fakeWire.drawRect(x + this.dimension/5, y, this.dimension*3/5, this.dimension/10)
        this.fakeWire.drawCircle(x + this.dimension*4/5, y +this.dimension/20, this.dimension/8);
        this.fakeWire.drawCircle(x+this.dimension/5, y +this.dimension/20, this.dimension/8);
        this.fakeWire.interactive = true;
        this.fakeWire.dragging = false;
        this.fakeWire.endFill();

        this.app.stage.addChild(this.fakeWire);

    }

    makeEraser(x, y){

        this.eraser = new PIXI.Text('Eraser', {fontFamily : 'Arial', fontSize: 18, fill :0x04b504, align : 'center' });
        this.eraser.x = x;
        this.eraser.y = y;
        this.eraser.interactive = true;

        this.app.stage.addChild(this.eraser);
    }

    makeCurrentSource(x, y) {

    }
}