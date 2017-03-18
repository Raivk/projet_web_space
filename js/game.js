//PLEASE PUT THIS SCRIPT AFTER THE LITTLE ONE LINER SCRIPT THAT GETS $_POST VAR IN PHP
//On devrait pouvoir récuperer ce qu'il y a dans $_POST à l'intérieur de la variable game_data si la ligne précédente a été respectée
//console.log(game_data);
$.getScript('./js/quintus_conf.js', function()
{
    $.getScript('./js/game_class.js', function()
    {
        //GAME CONF
        var min_dist_planets = 100;
        var planet_size = 64;
        var min_dist_from_borders = 64;
        var max_tries_place_planets = 40;
        
        var player_colors = [
            "#3bc4f7",
            "#6af73b",
            "#f7a23b",
            "#be3bf7"
        ];
        //END GAME CONF
        
        //UTILITY FUNCTIONS
        function randomIntFromInterval(min,max) {
            return Math.floor(Math.random()*(max-min+1)+min);
        }
        
        function calculate_new_planet_pos(planets_array) {
            let new_x = randomIntFromInterval(min_dist_from_borders, Q.width - min_dist_from_borders);
            let new_y = randomIntFromInterval(min_dist_from_borders, Q.height - min_dist_from_borders);

            if (planets_array.length > 0) {
                let trouv = false;
                let index = 0;
                let tries = 0;

                while (!trouv) {
                    if (tries == max_tries_place_planets) {
                        trouv = true;
                    } else {

                        let plan = planets_array[index];
                        if ((new_x < (plan.p.x + min_dist_planets) && new_x > (plan.p.x - min_dist_planets)) && (new_y < (plan.p.y + min_dist_planets) && new_y > (plan.p.y - min_dist_planets))) {
                            //new pos hit with an already existing planet, need to recalculate x and y, and retest for all planets 
                            index = 0;
                            tries++;
                            new_x = randomIntFromInterval(min_dist_from_borders, Q.width - min_dist_from_borders);
                            new_y = randomIntFromInterval(min_dist_from_borders, Q.height - min_dist_from_borders);
                        } else {
                            if (index == planets_array.length - 1) {
                                trouv = true;
                            } else {
                                index++;
                            }
                        }
                    }
                }    
            }
            
            return [new_x,new_y];
        }
        //END UTILITY FUNCTIONS
        
        function setUp (stage) {
            //SETUP THE SCENE STAGE
            
            //Get php vars
            var nb_planets = parseInt(game_data.nb_planets);
            var pop_begin = parseInt(game_data.pop_begin);
            var nb_players = parseInt(game_data.nb_ennemies) + 1;
            
            var planets = [];
            
            //place planets
            for (var i = 0; i < nb_players; i++) {
                for (var j = 0; j < nb_planets; j++) {
                    let pos = calculate_new_planet_pos(planets);
                    let planet = stage.insert(new Q.Planet({x:pos[0], y:pos[1], population:pop_begin, player:(i+1)}));
                    planet.p.pop_label_container = stage.insert(new Q.UI.Container({
                        fill: "#424242",
                        x: planet.p.x,
                        y: planet.p.y
                    }));
                    planet.p.pop_label = stage.insert(new Q.UI.Text({ 
                        label: planet.p.population + "",
                        color: player_colors[i],
                        align: 'center',
                        size: 18,
                        x: 0,
                        y: -2
                    }), planet.p.pop_label_container);
                    planet.p.pop_label_container.fit();
                    planets.push(planet);
                }
            }
            
            stage.add('viewport');

        }

        //Setup the scene
        Q.scene('space', function (stage) {
            setUp(stage);
        });

        var files = [
            'planet_1.png'
        ]

        Q.load(files.join(','), function() {
            // Sprites sheets can be created manually
            Q.sheet("planets","planet_1.png", { tilew: planet_size, tileh: planet_size });

            // Finally, call stageScene to run the game
            Q.stageScene("space");
        });
        
        
    });
});
    




