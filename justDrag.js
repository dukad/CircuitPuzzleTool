
const app = new PIXI.Application(
    {
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x11111,
            resolution: devicePixelRatio = 5,
            autoDensity : true
    }
)
document.body.appendChild(app.view)
for(var i = 0; i < 3; i++){
        var square = new PIXI.Graphics();
        square.beginFill(0x00ff00);
        square.drawRect(0, 0, 50, 50);
        square.endFill();
        square.x = 100 + i*70;
        square.y = 100;
        square.interactive = true;
        square.buttonMode = true;
        app.stage.addChild(square);
}



square.on('pointerover', (event) => onPointerOver(square));

function onPointerOver(object){
      object.height =1;


}



























