
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
/*const onDragStart = event => {
        square.data = event.data;

        square.dragging = true;
};*/






/*const onDragEnd = event => {
        delete square.data;

        square.dragging = false;
};*/



/*
const onDragMove = event => {
        if( square.dragging=== true){
          const newPosn = square.data.getLocalPosition(square.parent);
          square.x = newPosn.x ;
          square.y = newPosn.y ;
        }

};
*/

/*square.on('mousedown', onDragStart)
    .on('mouseup', onDragEnd)
    .on('mouseout' && 'mouseup', onDragEnd)
    .on('pointermove', onDragMove);*/

square
    .on('mousedown', onDragStart)
    .on('touchstart', onDragStart)
    .on('mouseup', onDragEnd)
    .on('mouseupoutside', onDragEnd)
    .on('touchend', onDragEnd)
    .on('touchendoutside', onDragEnd)
    .on('mousemove', onDragMove)
    .on('touchmove', onDragMove);

function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}

/*
square.on('mousedown', function (e) {
    console.log('Picked up');

    square.x = e.data.global.x;
    square.y = e.data.global.y;
    square.dragging = true;
});

square.on('mousemove', function (e) {
    console.log('Dragging');

    if (square.dragging) {
        square.x = e.data.global.x;
        square.y = e.data.global.y;
    }
});

square.on('mouseup', function (e) {
    console.log('Moving');

    square.x = e.data.global.x;
    square.y = e.data.global.y;
    square.dragging = false;
});
*/








