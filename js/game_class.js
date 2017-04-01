//Première classe, Planet
Q.Sprite.extend('Planet', {
    
    //Constructeur
    init: function (p) {
        //Initialisation des attributs par défaut (Fournir un objet à la construction qui change certain de ces attributs "override" leur initialisation par défaut)
        this._super(p, {
            sheet: 'planets',
            name: "defaultname",
            frame: Math.floor((Math.random() * 10)),
            population:0,
            player:0,
            pl_color:"#ffffff",
            pop_label:undefined,
            pop_label_container:undefined,
            dragging:false,
            spawned_ship:undefined,
            collisionLayer:Q.SPRITE_ENEMY,
            collisionMask:Q.SPRITE_ENEMY,
            my_turn:false,
            growth:Math.floor((Math.random() * 10) + 1),
            inc_pop:function() {
                //incrémente la population si cette planète n'est pas neutre
                if (this.player != 0) {
                    this.population += this.growth;
                }
            }
        });
        //Activation des évenements de drag, fin de drag, et activation du module 2D
        this.on("drag");
        this.on("touchEnd");
        this.add('2d');
    },
    //Fonction appelée à chaque frame, donc si le jeu tourne à 30 images par seconde, elle sera appelée 30 fois par seconde.
    //Elle est appelée avant le dessin de l'image
    step: function (dt) {
        
        if (this.p.my_turn) {
            this.p.angle = (this.p.angle + 15 * dt) % 360;
        }
        
        //Si le label est bien défini
        if (this.p.pop_label != undefined) {
            //Si la planète n'est pas neutre, on actualise le label avec le nombre d'habitants
            if (this.p.player != 0) {
                this.p.pop_label.p.label = this.p.population + "";
            } else {
                //Si la planète est neutre, on se contente d'un "?"
                this.p.pop_label.p.label = "?";
            }
        }
        //Si le conteneur du label est bien défini on met à jour sa position (si il aurait été bougé ailleurs par inadvertance)
        if (this.p.pop_label_container != undefined) {
            this.p.pop_label_container.p.x = this.p.x;
            this.p.pop_label_container.p.y = this.p.y;
            this.p.pop_label_container.fit();   
        }
    },
    //Appelée quand on bouge la souris avec une action de "drag" (clique sur le sprite, rester avec le bouton enfoncé et bouger la souris)
    //le paramètre touch contient toutes les infos de l'évenement
    drag: function(touch) {
        //récupération du stage
        let stage = Q.stage(0);
        //Si on n'était pas déjà en train de drag, on démarre une nouvelle action de drag, et on affiche un vaisseau sous le curseur de la souris
        if (!this.p.dragging && this.p.population > 0 && this.p.player == 1 && this.p.my_turn) {
            this.p.dragging = true;
            this.p.spawned_ship = stage.insert(new Q.Ship({x:touch.x, y:touch.y,orig_pos:[this.p.x,this.p.y],stroke_color:this.p.pl_color}));
        } else if(this.p.my_turn){
            //Si le vaisseau sous la souris est bien défini
            if (this.p.spawned_ship != undefined) {
                //Recalcul de son angle par rapport à la planète de départ
                this.p.spawned_ship.p.angle = Math.atan2(touch.x - touch.origX, - (touch.y - touch.origY) )*(180/Math.PI);
                //Mise à jour de sa position par rapport à la position de la souris
                this.p.spawned_ship.p.x = touch.x;
                this.p.spawned_ship.p.y = touch.y;
                
                //On garde dans une variable le "this"
                let temp_vm = this;
                //on parcourt les planètes, si il se trouve qu'on en survolle une, on change la couleur de fond de son label, donne du retour à l'utilisateur
                stage.items.forEach(function(thing) {
                    if (thing.p.sheet == 'planets') {
                        if (((temp_vm.p.spawned_ship.p.x < (thing.p.x + 32)) && temp_vm.p.spawned_ship.p.x > (thing.p.x - 32)) 
                            && ((temp_vm.p.spawned_ship.p.y < (thing.p.y + 32)) && temp_vm.p.spawned_ship.p.y > (thing.p.y - 32))) {
                            //ON SURVOLLE UNE PLANETE
                            
                            if (thing != temp_vm) {
                               //CETTE PLANET EST DIFFERENTE DE CELLE DE DEPART
                                thing.p.pop_label_container.p.fill = "white";
                            }
                            
                        } else {
                            //ON NE SURVOLLE PAS CETTE PLANETE ON REMET UN FOND NORMAL SI IL ETAIT CHANGE
                            thing.p.pop_label_container.p.fill = "#424242";
                        }
                    }
                });
            }
        }
    },
    //Appelée à la fin d'un évenement de drag.
    touchEnd: function(touch) {
        if(this.p.my_turn){
            //Fin du drag
            this.p.dragging = false;
            //récuperation du stage
            let stage = Q.stage(0);
            //Le vaisseau existe bien
            if (this.p.spawned_ship != undefined) {
                //stockage du this
                let temp_vm = this;
                //On parcourt les planètes
                stage.items.forEach(function(thing) {
                    if (thing.p.sheet == 'planets') {
                        //c'est une planète
                        if (thing.p.pop_label_container.p.fill == "white") {
                            //Bingo, elle est sélectionnée (vaisseau au dessus)
                            thing.p.pop_label_container.p.fill = "#424242";
                            //On calcule les données pour un éventuel transfert de population
                            let distance = (Math.abs(thing.p.x - temp_vm.p.x) + Math.abs(thing.p.y - temp_vm.p.y));
                            stage.current_attack = {
                                from : temp_vm,
                                to : thing,
                                distance : distance,
                                duration : Math.ceil( distance / temp_vm.p.spawned_ship.p.speed)
                            };
                            //On affiche et configure le popup de transfert de population
                            document.getElementById("full_background_atk").classList.remove("hide");
                            document.getElementById("attack_form").classList.remove("hide");
                            document.getElementById("attack_menu").classList.remove("hide");
                            document.getElementById("attack_start").value = temp_vm.p.name;
                            document.getElementById("attack_target").value = thing.p.name;
                            document.getElementById("attack_start_pop_max").value = temp_vm.p.population;
                            if (thing.p.player == 0) {
                                //Target planet is neutral, hide its population
                                document.getElementById("attack_target_pop").value = "?";
                            } else {
                                //Target planet isn't neutral, show its population
                                document.getElementById("attack_target_pop").value = thing.p.population;
                            }
                            document.getElementById("attack_pop").value = 1;
                            document.getElementById("attack_pop").min = 1;
                            document.getElementById("attack_pop").max = temp_vm.p.population;
                            document.getElementById("arrival").value = stage.current_attack.duration + " tours";
                        } else {
                            //cette planète n'est pas sélectionnée, on ne fait rien
                        }
                    }
                });
                //Une fois qu'on a vérifié si il y avait une planète sélectionnée (si oui, on a déjà affiché le popup), on supprime le vaisseau sous le curseur
                this.p.spawned_ship.destroy();
            }
        }
    }
});










//Seconde classe, celle des vaisseaux
Q.Sprite.extend('Ship', {
    //Constructeur
    init: function (p) {
        //Initialisation des attributs par défaut
        this._super(p, {
            sheet: 'spaceship',
            frame: 0,
            population:0,
            player:0,
            stroke_color:"#ffffff",
            speed:250,
            dest_pos:[0,0],
            orig_pos:[0,0],
            my_turn:false,
            collisionLayer:Q.SPRITE_NONE,
            collisionMask:Q.SPRITE_NONE,
            remain_turns:10,
            pop_label:undefined,
            pop_label_container:undefined,
            destination_planet:undefined,
            moving: false,
            moves: 0,
            total:0
        });
        //Activation du module 2D
        this.add('2d');
    },
    draw: function(ctx) {
        //Déssine une ligne de l'origine jusque la destination
        ctx.beginPath();
        if (this.p.destination_planet == undefined) {
            this.p.dest_pos = [this.p.x, this.p.y];
        }
        ctx.moveTo(0, - 8 + Math.sqrt(((this.p.orig_pos[0] - this.p.x) * (this.p.orig_pos[0] - this.p.x)) + ((this.p.orig_pos[1] - this.p.y) * (this.p.orig_pos[1] - this.p.y))));
        ctx.lineTo(0, 10 + (- Math.sqrt(((this.p.dest_pos[0] - this.p.x) * (this.p.dest_pos[0] - this.p.x)) + ((this.p.dest_pos[1] - this.p.y) * (this.p.dest_pos[1] - this.p.y)))));
        ctx.strokeStyle = this.p.stroke_color;
        ctx.lineWidth = 4;
        ctx.stroke();
        //Déssine le vaisseau
        if (this.p.sheet) {
            this.sheet().draw(ctx,-this.p.cx,-this.p.cy,this.p.frame);
        } else if(this.p.asset) {
            ctx.drawImage(Q.asset(this.p.asset), -this.p.cx, -this.p.cy);
        } else if(this.p.color) {
            ctx.fillStyle = this.p.color;
            ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
        }
    },
    //Appelée à chaque frame
    step: function (dt) {
        //Si le label est bien défini, on met à jour sa position
        if (this.p.pop_label_container != undefined) {
            this.p.pop_label_container.p.x = this.p.x;
            this.p.pop_label_container.p.y = this.p.y - 20;
            this.p.pop_label_container.fit();
        }
        //Changement de la couleur du vaisseau suivant le joueur le contrôlant
        if (this.p.frame != this.p.player) {
            this.p.frame = this.p.player;
        }
        
        //Si le vaisseau est à l'adversaire, on cache sa population
        if (this.p.player != 1) {
            if (this.p.pop_label != undefined) {
                this.p.pop_label.p.label = "?";    
            }
        }
        
        //Si le tour est activé et qu'il nous reste des déplacements, on joue une action (on se déplace)
        if (this.p.my_turn && this.p.remain_turns > 0) {
            //Si on est pas déjà en train de bouger
            if (!this.p.moving) {
                this.p.moving = true;
                this.p.moves = 90;
                this.p.total = 0;
            } else {
                //Sinon, si il reste du déplacement à faire ce tour
                if (this.p.moves > 0) {
                    // On doit limiter la distance parcoure, a tendance à faire des excès imprévus
                    if (this.p.total < this.p.speed) {
                        //Calcul du déplacement, et déplacement
                        dir = [
                            this.p.dest_pos[0] - this.p.x,
                            this.p.dest_pos[1] - this.p.y
                        ];
                        hyp = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1]);
                        dir[0] = dir[0] / hyp;
                        dir[1] = dir[1] / hyp;
                        
                        this.p.x += dir[0] * (this.p.speed / 90);
                        this.p.y += dir[1] * (this.p.speed / 90);

                        this.p.total += Math.abs(dir[0] * (this.p.speed / 90));
                        this.p.total += Math.abs(dir[1] * (this.p.speed / 90));
                        
                        this.p.moves--;
                    } else {
                        this.p.moves = 0;
                    }
                } else {
                    //Sinon, résolution du tour
                    this.p.moving = false;
                    
                    //Ce n'est plus notre tour, on change le booléen
                    this.p.my_turn = false;
                    
                    //On diminue le nombre d'actions possible, on vient d'en consommer une
                    this.p.remain_turns -= 1;
                    //Si il ne reste plus d'actions (== on est arrivé à destination !)
                    if (this.p.remain_turns == 0) {
                        console.log("finished_turns");
                        //Si la planète de destination est bien définie
                        if (this.p.destination_planet != undefined) {
                            console.log("resolved destination");
                            //Stockage de la destination dans une variable, plus court à appeler
                            let dest_plan = this.p.destination_planet;
                            //si c'est une planète alliée, on transfert simplement la population
                            if (dest_plan.p.player == this.p.player) {
                                dest_plan.p.population += this.p.population;
                                toastr.info("Transfert terminé de "+ this.p.population +" personnes pour le joueur " + this.p.player + " vers " + dest_plan.p.name + ".");
                                console.log("allied planet reached, population transfered");
                            } else {
                                //C'est une planète ennemie, plus compliqué

                                //On gagne, changement de propriétaire de la planète destination, calcul de population
                                if (this.p.population > dest_plan.p.population) {
                                    toastr.success("La planète " + dest_plan.p.name + ((dest_plan.p.player == 0) ? (" d'allégeance neutre") : (" possédée par le joueur " + dest_plan.p.player)) + " a été conquise par le joueur " + this.p.player + ".");
                                    dest_plan.p.population = this.p.population - dest_plan.p.population;
                                    dest_plan.p.player = this.p.player;
                                    dest_plan.p.pl_color = this.p.stroke_color;
                                    dest_plan.p.pop_label.p.color = this.p.stroke_color;
                                    console.log("ennemy/neutral planet reached, won battle");
                                    if(Q.tour_actuel == (this.p.player - 1)){
                                        dest_plan.p.my_turn = true;
                                    }
                                } else {
                                    //Egalité, la planète devient neutre
                                    if (this.p.population == this.p.destination_planet.p.population) {
                                        console.log("no winner, planet becomes neutral");
                                        toastr.warning("La planète " + dest_plan.p.name + ((dest_plan.p.player == 0) ? (" d'allégeance neutre") : (" possédée par le joueur " + dest_plan.p.player)) + " a subit une attaque dont aucun n'est ressorti vivant.");
                                        dest_plan.p.player = 0;
                                        dest_plan.p.population = 0;
                                        dest_plan.p.pop_label.p.color = "white";
                                        dest_plan.p.pop_label.p.label = "?";
                                    } else {
                                        //Combat perdu, on diminue la population de la planète attaquée
                                        console.log("lost battle");
                                        toastr.error("La planète " + dest_plan.p.name + ((dest_plan.p.player == 0) ? (" d'allégeance neutre") : (" possédée par le joueur " + dest_plan.p.player)) + " s'est bien défendue face aux attaquants du joueur " + this.p.player + ".");
                                        dest_plan.p.population -= this.p.population;
                                    }
                                }
                            }
                        }
                        //Suppression du vaisseau et de ses labels
                        if (this.p.pop_label != undefined) {
                            this.p.pop_label.destroy();
                        }
                        if (this.p.pop_label_container != undefined) {
                            this.p.pop_label_container.destroy();
                        }
                        this.destroy();
                    }
                }
            }
        }
    }
});