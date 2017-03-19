//Initialisation de Quintus
var Q = Quintus({audioSupported: [ 'wav' ]})
      .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio')
      .setup({ maximize: true })
      .enableSound();

//Contrôles par défaut, mais on ne les utilisera pas (on les garde au cas où)
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
//Activation des contrôles souris
Q.input.mouseControls({cursor:true});

//Pas de gravité, jeu spatial
Q.gravityY = 0;

//Activation de contrôles tactiles (sert en particulier pour activer le "drag" sur la souris) sur toutes les classes dérivant sprite
Q.touch(Q.SPRITE_ALL);