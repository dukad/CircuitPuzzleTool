
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
var square = new PIXI.Graphics();
square.beginFill(0x00ff00);
square.drawRect(0, 0, 50, 50);
square.endFill();
square.x = 100;
square.y = 100;
square.interactive = true;

square.dragging = false;


app.stage.addChild(square);





// setup events

square.on('pointerdown', () => {
        console.log("Clicked")
});

const onDragStart = event => {
        square.data = event.data;
        square.dragging = true;
};


const onDragEnd = event => {
        delete square.data;

        square.dragging = false;
};

const onDragMove = event => {
        if( square.dragging=== true){
          const newPosn = square.data.getLocalPosition(square.parent);
          square.x = newPosn.x ;
          square.y = newPosn.y ;
        }

};

square.on('mousedown', onDragStart)
    .on('mouseup', onDragEnd)
    .on('mouseout' && 'mouseup', onDragEnd)
    .on('pointermove', onDragMove);











