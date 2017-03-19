//PLEASE PUT THIS SCRIPT AFTER THE LITTLE ONE LINER SCRIPT THAT GETS $_POST VAR IN PHP
//On devrait pouvoir récuperer ce qu'il y a dans $_POST à l'intérieur de la variable game_data si la ligne précédente a été respectée
//console.log(game_data);

//Définitions préalables pour les boutons du menu de transfert
var cancel_atk = function() {
    //NOTHING
}

var confirm_atk = function() {
    //NOTHING
}

//Récupération préalable du code contenu dans le fichier pour la configuration de Quintus.js
$.getScript('./js/quintus_conf.js', function()
{
    //Récupération préalable des classes correspondant au jeu (Planet et Ship)
    $.getScript('./js/game_class.js', function()
    {
        //VARIABLES POUR LE JEU -------------------------------------
        var min_dist_planets = 100;
        var planet_size = 64;
        var min_dist_from_borders = 64;
        var max_tries_place_planets = 40;
        var space_ship_size = 16;
        
        var player_colors = [
            "#3bc4f7",
            "#6af73b",
            "#f7a23b",
            "#be3bf7"
        ];
        //END VARIABLES POUR LE JEU -------------------------------------
        
        //FONCTIONS UTILITAIRES -------------------------------------
        
        //Entier aléatoire entre deux bornes
        function randomIntFromInterval(min,max) {
            return Math.floor(Math.random()*(max-min+1)+min);
        }
        
        //Génère une position valide aléatoire pour une nouvelle planète, sans empiéter si possible sur les planètes déjà existantes (dans planets_array)
        //Utilisé pour la génération de niveau aléatoire
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
        
        //END FONCTIONS UTILITAIRES -------------------------------------
        
        //Redéfinitions des méthodes pour les boutons
        cancel_atk = function() {
            //Transfert annulé, on cache juste les menus, on a rien d'autre à faire
            document.getElementById("full_background_atk").classList.add("hide");
            document.getElementById("attack_menu").classList.add("hide");
            document.getElementById("attack_form").classList.add("hide");
        }
        
        confirm_atk = function() {
            //Transfert confirmé. On cache les menus, et on initialise le transfert
            document.getElementById("full_background_atk").classList.add("hide");
            document.getElementById("attack_menu").classList.add("hide");
            document.getElementById("attack_form").classList.add("hide");
            
            //Récupération du stage
            let stage = Q.stage(0);
            
            //Création du vaisseau, ainsi que du label indiquant la population à bord (et le container qui va avec (= fond derrière le label correspondant à la population))
            let container = stage.insert(new Q.UI.Container({
                                fill: "#424242",
                                x: stage.current_attack.from.p.x,
                                y: stage.current_attack.from.p.y
                            }));
            let ship = stage.insert(new Q.Ship({
                x: stage.current_attack.from.p.x,
                y: stage.current_attack.from.p.y,
                angle: Math.atan2(stage.current_attack.to.p.x - stage.current_attack.from.p.x, - (stage.current_attack.to.p.y - stage.current_attack.from.p.y) )*(180/Math.PI),
                population: parseInt(document.getElementById("attack_pop").value),
                player: stage.current_attack.from.p.player,
                speed: (stage.current_attack.distance / stage.current_attack.duration),
                dest_pos: [stage.current_attack.to.p.x,
                           stage.current_attack.to.p.y],
                remain_turns: stage.current_attack.duration,
                pop_label_container: container,
                pop_label: stage.insert(new Q.UI.Text({
                                            label: parseInt(document.getElementById("attack_pop").value) + "",
                                            color: player_colors[0],
                                            align: 'center',
                                            size: 18,
                                            x:0,
                                            y:0
                                        }), container),
                destination_planet:stage.current_attack.to

            }));
            //Réduction de la population de la planète de départ
            stage.current_attack.from.p.population -= ship.p.population;
            
            //Si on a vidé la planète de sa population, elle devient neutre
            if (stage.current_attack.from.p.population == 0) {
                //PLANET BECOMES NEUTRAL
                stage.current_attack.from.p.player = 0;
                stage.current_attack.from.p.pop_label.p.color = "white";
                stage.current_attack.from.p.pop_label.p.label = "?";
            }  
        }
        
        //Mise en place de la scène
        function setUp (stage) {
            //SETUP THE SCENE STAGE
            
            //Ici, on récupère les variables transmises par le serveur via PHP
            var nb_planets = parseInt(game_data.nb_planets);
            var pop_begin = parseInt(game_data.pop_begin);
            var nb_players = parseInt(game_data.nb_ennemies) + 1;
            
            var planets = [];
            
            //On place les planètes, toutes neutres
            for (var i = 0; i < nb_planets; i++) {
                let pos = calculate_new_planet_pos(planets);
                let planet = stage.insert(new Q.Planet({x:pos[0], y:pos[1], population:pop_begin, player:0, population:Math.floor(Math.random() * 50)}));
                planet.p.pop_label_container = stage.insert(new Q.UI.Container({
                    fill: "#424242",
                    x: planet.p.x,
                    y: planet.p.y
                }));
                planet.p.pop_label = stage.insert(new Q.UI.Text({ 
                    label: "?",
                    color: "white",
                    align: 'center',
                    size: 18,
                    x: 0,
                    y: -2
                }), planet.p.pop_label_container);
                planet.p.pop_label_container.fit();
                planets.push(planet);
            }
            
            //Pour chaque joueur, on lui attribue une planète au hasard. (On veille à ne pas tomber deux fois sur la même)
            //De plus, chaque joueur commencera avec la même population de départ, et la même croissance démographique.
            let selected = [];
            for (var i = 0; i < nb_players; i++) {
                let rand = Math.floor(Math.random() * nb_planets);
                while (selected.includes(rand)) {
                    rand = Math.floor(Math.random() * nb_planets);
                }
                planets[rand].p.player = i + 1;
                planets[rand].p.population = pop_begin;
                planets[rand].p.growth = 5;
                planets[rand].p.pop_label.p.color = player_colors[i];
                planets[rand].p.pop_label.p.label = planets[rand].p.population + "";
                selected.push(rand);
            }
            
            stage.add('viewport');

        }

        //Préparation de la scène, on apppelle la fonction setUp vue au dessus
        Q.scene('space', function (stage) {
            setUp(stage);
        });
        
        //Assets
        var files = [
            'planet_1.png',
            'spaceship.png'
        ]
        
        //Chargement des assets
        Q.load(files.join(','), function() {
            // Sprites sheets can be created manually
            Q.sheet("planets","planet_1.png", { tilew: planet_size, tileh: planet_size });
            Q.sheet("spaceship","spaceship.png", { tilew: space_ship_size, tileh: space_ship_size});
            // Finally, call stageScene to run the game
            Q.stageScene("space");
        });
        
        
    });
});
    




