//Initialize the game with Quintus
var Q = Quintus({audioSupported: [ 'wav' ]})
      .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio')
      .setup({ maximize: true })
      .enableSound();

//Setup controls : both azerty + qwerty + arrows
Q.input.keyboardControls({
                           90: "up",
                           87: "up",
                           81: "left",
                           65: "left",
                           83: "down",
                           68: "right",
                           UP: "up",
                           LEFT: "left",
                           RIGHT: "right",
                           DOWN: "down",
                           32: "fire"
                         });
//Enable mouse controls
Q.input.mouseControls({cursor:true});

//No gravity, space game
Q.gravityY = 0;