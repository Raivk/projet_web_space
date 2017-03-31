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

var change_turn = function() {
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
        var min_dist_from_borders = 80;
        var max_tries_place_planets = 10000;
        var max_tries_find_bot_target = 1000;
        var space_ship_size = 16;
        var nb_players = 0;
        Q.tour_actuel = 0;
        var planets = [];
        var grow = false;
        
        var players_left = [];
        var player_colors = [
            "#3bc4f7",
            "#6af73b",
            "#f7a23b",
            "#be3bf7"
        ];
        
        //Fond d'écran aléatoire, fichiers
        var backgrounds = [
            './images/backgrounds/cartographer.png',
            './images/backgrounds/congruent_outline.png',
            './images/backgrounds/dark-wood.jpg',
            './images/backgrounds/ep_naturalblack.png',
            './images/backgrounds/escheresque_ste.png',
            './images/backgrounds/footer_lodyas.png',
            './images/backgrounds/grey_wash_wall.png',
            './images/backgrounds/stardust.png',
            './images/backgrounds/use_your_illusion.png',
            './images/backgrounds/zwartevilt.png'
        ];
        
        //préfixes pour les noms de planètes aléatoires
        var prefixes = [
            "Gor",
            "Pul",
            "Mo-",
            "AB.",
            "Obé",
            "Rmu",
            "Iao",
            "Ity",
            "Jjy",
            "Eki",
            "Kro",
            "X-2",
            "A-4",
            "Yo-"
        ];
        
        //facteurs pour les noms de planètes aléatoires
        var factors = [
            "orb",
            "iaz",
            "-U-",
            ".2.",
            "éué",
            "dza",
            "pas",
            "eij",
            "fek",
            "wos",
            "xum",
            "5-S",
            "D-4",
            "OX7"
        ];
        
        //suffixes pour les noms de planètes aléatoires
        var suffixes = [
            "tol",
            "oxi",
            "-B7",
            "888",
            "aié",
            "oel",
            "ske",
            "ask",
            "bso",
            "zox",
            "mqe",
            "-25",
            "-2D",
            "B29"
        ];
        
        $('body').css('background-image', 'url(' + backgrounds[randomIntFromInterval(0,backgrounds.length - 1)] + ')');
        $('body').css('background-repeat', 'repeat');
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
        
        
        //Redéfinitions des méthodes pour les boutons ---------------------------------------------------------------------------------- 
        cancel_atk = function() {
            //Transfert annulé, on cache juste les menus, on a rien d'autre à faire
            document.getElementById("full_background_atk").classList.add("hide");
            document.getElementById("attack_menu").classList.add("hide");
            document.getElementById("attack_form").classList.add("hide");
        }
        
        confirm_atk = function(population_param) {
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
            
            //Verification : on est pas censé pouvoir aller au delà de la population max de la planète dans le champs de saisie
            //Mais, c'est faisable en entrant les chiffres directement. (Testé sous le navigateur Opera Neon)
            let pop_to_send = (population_param == undefined) ? parseInt(document.getElementById("attack_pop").value) : population_param;
            if (pop_to_send > stage.current_attack.from.p.population) {
                pop_to_send = stage.current_attack.from.p.population;
            }
            if (pop_to_send == undefined || pop_to_send == 0) {
                pop_to_send = 1;
            }
            //Construction du vaisseau, et insertion dans le stage
            let ship = stage.insert(new Q.Ship({
                x: stage.current_attack.from.p.x,
                y: stage.current_attack.from.p.y,
                angle: Math.atan2(stage.current_attack.to.p.x - stage.current_attack.from.p.x, - (stage.current_attack.to.p.y - stage.current_attack.from.p.y) )*(180/Math.PI),
                population: pop_to_send,
                player: stage.current_attack.from.p.player,
                stroke_color: player_colors[stage.current_attack.from.p.player - 1],
                speed: (stage.current_attack.distance / stage.current_attack.duration),
                dest_pos: [stage.current_attack.to.p.x,
                           stage.current_attack.to.p.y],
                orig_pos: [stage.current_attack.from.p.x,
                          stage.current_attack.from.p.y],
                remain_turns: stage.current_attack.duration,
                pop_label_container: container,
                pop_label: stage.insert(new Q.UI.Text({
                                            label: pop_to_send + "",
                                            color: stage.current_attack.from.p.pl_color,
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
        
        function eliminerJoueur(i){
            document.getElementById("player_"+(i+1)).classList.add("joueur_mort");
            toastr.error("Le joueur "+ (i+1) +" a été éliminé.");
            players_left[i]=0;
        }
        
        function jouerBot(){
            
            let stage = Q.stage(0);
            
            let max = 0;
            
            let planetPlaying = undefined;
            
            stage.items.forEach(function(item){
                if(item.p.sheet == "planets"){
                    if((item.p.player == Q.tour_actuel+1) && (max < item.p.population)){
                        max = item.p.population;
                        planetPlaying = item;
                    }
                }
            });
            
            if (planetPlaying == undefined) {
                console.log("something went wrong, no planets to make an action. Passing onto the next player.");
                setTimeout(function() {
                    change_turn();
                }, 750);
            } else {
                let rand = randomIntFromInterval(0,planets.length-1);
                let tries = 0;
                while (planets[rand] == planetPlaying || tries >= max_tries_find_bot_target) {
                    rand = randomIntFromInterval(0,planets.length-1);
                }
                let planetAttacked = planets[rand];
                let distance = (Math.abs(planetAttacked.p.x - planetPlaying.p.x) + Math.abs(planetAttacked.p.y - planetPlaying.p.y));

                stage.current_attack = {
                    from: planetPlaying,
                    to: planetAttacked,
                    distance: distance,
                    duration: Math.ceil(distance/250)
                };
                setTimeout(function(){
                    let to_send = randomIntFromInterval(1, Q.stage(0).current_attack.from.p.population);
                    confirm_atk(to_send);
                    change_turn();
                }, 750);
            }
        }
        
        function findepartie(isPlayer){
            if(isPlayer){
                toastr.success("Vous avez gagné !");
            }
            else{
                toastr.error("Défaite ! Le bot n°"+(Q.tour_actuel+1)+" a gagné !");
            }
            setTimeout(function(){
                    window.location.href = "./index.php";
                },5000);
        }
        
        function wait_ships() {
            let stage = Q.stage(0);
            
            let ships_are_moving = false;
            
            stage.items.forEach(function(thing) {
               if (thing.p.sheet == "spaceship") {
                    if (thing.p.my_turn == true) {
                        ships_are_moving = true;
                    }
               } 
            });
            
            if (!ships_are_moving) {
                if(Q.tour_actuel != 0){
                    
                    document.getElementById("turn_bt").disabled = true;
                    jouerBot();
                }
                else{
                    document.getElementById("turn_bt").disabled = false;
                }
            } else {
                setTimeout(wait_ships, 500);
            }
        }
        
        change_turn = function(){
            
            document.getElementById("turn_bt").disabled = true;
            
            let nb_plan_players = [];
            let nbPlayersLeft = 0;
            let stage = Q.stage(0);
            document.getElementById("player_" + (Q.tour_actuel + 1)).classList.remove("hud_my_turn");
            Q.tour_actuel = ((Q.tour_actuel +1)%nb_players);
            
            if(Q.tour_actuel != 0 && !grow){
                grow = true;
            }
            
            if(Q.tour_actuel == 0 && grow == true){
                planets.forEach(function(element){
                        element.p.inc_pop();
                    });
            }
            
            for(i = 0; i<nb_players; i++){
                nb_plan_players.push(0);
            }
            
            stage.items.forEach(function(item){
                if(item.p.sheet == "planets" || item.p.sheet == "spaceship"){
                    if(item.p.player != 0){
                        nb_plan_players[item.p.player -1]++;
                    }
                }
            });

            for(i = 0; i<nb_players; i++){
                if(nb_plan_players[i] == 0 && players_left[i] != 0){
                    eliminerJoueur(i);
                }
            }
            
            players_left.forEach(function(element){
                if(element == 1){
                    nbPlayersLeft++;
                }
            });
            
            if(players_left[0] == 0 && nbPlayersLeft == 1){
                Q.tour_actuel = players_left.findIndex(function(element){
                    return element == 1;
                });
                findepartie(false);
            }
            else if(players_left[0] == 1 && nbPlayersLeft == 1){
                findepartie(true);
            }
            else{
                
                while(players_left[Q.tour_actuel]!=1){
                    Q.tour_actuel = ((Q.tour_actuel +1)%nb_players);
                    if(Q.tour_actuel == 0 && grow == true){
                        planets.forEach(function(element){
                            element.p.inc_pop();
                        });
                    }
                }
                
                stage.items.forEach(function(item){
                    if(item.p.sheet == "planets" || item.p.sheet == "spaceship"){
                        if(item.p.player == Q.tour_actuel + 1){
                            item.p.my_turn = true;
                        }
                        else if (item.p.sheet == "planets") {
                            item.p.my_turn = false;
                        }
                    }
                });
                
                
                document.getElementById("player_" + (Q.tour_actuel + 1)).classList.add("hud_my_turn");
                
                wait_ships();
            }
        }
        
        function init_tour(){
            Q.tour_actuel = 0;
            planets.forEach(function(plan){
                if(plan.p.player == (Q.tour_actuel +1)){
                    plan.p.my_turn = true;
                }
            });
        }
        
    
        //Fin de redéfinition des méthodes pour les boutons ----------------------------------------------------------------------------------
        
        
        
        
        //Mise en place de la scène ----------------------------------------------------------------------------------
        function setUp (stage) {
            //SETUP THE SCENE STAGE
            
            //Ici, on récupère les variables transmises par le serveur via PHP
            var nb_planets = parseInt(game_data.nb_planets);
            var pop_begin = parseInt(game_data.pop_begin);
            nb_players = parseInt(game_data.nb_ennemies) + 1;
            
            for(i=0; i<nb_players; i++){
                players_left.push(1);
            }
            
            //On place les planètes, toutes neutres
            for (var i = 0; i < nb_planets; i++) {
                let pos = calculate_new_planet_pos(planets);
                let planet = stage.insert(new Q.Planet({x:pos[0],
                                                        y:pos[1],
                                                        player:0,
                                                        population:Math.floor(Math.random() * 50),
                                                        name: prefixes[randomIntFromInterval(0,prefixes.length - 1)]
                                                            + factors[randomIntFromInterval(0,factors.length - 1)]
                                                            + suffixes[randomIntFromInterval(0,suffixes.length - 1)]
                                                       }));
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
                planets[rand].p.pl_color = player_colors[i];
                selected.push(rand);
            }
            
            //Mise en place de l'HUD
            /*let hud = document.getElementById("HUD");
            for (var i = 0; i < nb_players; i++) {
                let play_hud = document.createElement("div");
                play_hud.setAttribute("id", "player_" + (i + 1));
                play_hud.innerHTML = "Joueur " + (i + 1);
                play_hud.classList.add("players_hud");
                if (i == 0) {
                    play_hud.classList.add("hud_my_turn");
                }
                hud.appendChild(play_hud);
            }*/
            
            stage.add('viewport');
            init_tour();
            

        }
        //Fin de la ise en place de la scène ----------------------------------------------------------------------------------

        //Préparation de la scène, on apppelle la fonction setUp vue au dessus
        Q.scene('space', function (stage) {
            setUp(stage);
        });
        
        //Assets
        var files = [
            'planet_1.png',
            'spaceships.png'
        ];
        
        //Chargement des assets
        Q.load(files.join(','), function() {
            // Sprites sheets can be created manually
            Q.sheet("planets","planet_1.png", { tilew: planet_size, tileh: planet_size });
            Q.sheet("spaceship","spaceships.png", { tilew: space_ship_size, tileh: space_ship_size});
            // Finally, call stageScene to run the game
            Q.stageScene("space");
        });
        
        
    });
});
    




