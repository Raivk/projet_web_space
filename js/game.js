//PLEASE PUT THIS SCRIPT AFTER THE LITTLE ONE LINER SCRIPT THAT GETS $_POST VAR IN PHP
//On devrait pouvoir récuperer ce qu'il y a dans $_POST à l'intérieur de la variable game_data si la ligne précédente a été respectée
//console.log(game_data);

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

//Required by quintus
var objectFiles = [
    './js/game_class'
];

//SETUP STAGE
require(objectFiles, function () {
    function setUp (stage) {
    
        stage.add('viewport');
        
    }
});

//Setup the scene
Q.scene('space', function (stage) {
    setUp(stage);
});
