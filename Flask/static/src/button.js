import NodeVoltage from "./NodeVoltage.js";

export default class Button {
    constructor(locationx, locationy, sizex, sizey, app, matrix) {
        this.locationx = locationx
        this.locationy = locationy
        this.sizex = sizex
        this.sizey = sizey
        this.app = app
        this.matrix = matrix
        console.log('constructor running')
        this.graphic = new PIXI.Graphics
        this.text = null
        this.graphic.interactive = true
        this.graphic.buttonMode = true
        this.graphic.on('click', () => this.onClick())
    }

    draw() {
        /**
         * render the button, writing the display text on top
         */
        this.graphic.beginFill(0xd18719)
        this.graphic.drawRoundedRect(this.locationx, this.locationy, this.sizex, this.sizey)
        this.graphic.endFill()
        this.app.stage.addChild(this.graphic)

        this.text = new PIXI.Text('SOLVE', {fontFamily : 'Droid Serif', fontSize: 27, fill : 0xFFFFFF, align : 'center'});
        this.text.x = this.locationx + this.sizex/12
        this.text.y = this.locationy + this.sizey/6
        this.app.stage.addChild(this.text)
    }

    onClick() {
        let test = new NodeVoltage(this.matrix)
        test.solve()
    }
}