Q.Sprite.extend('Planet', {
    init: function (p) {
        this._super(p, {
            sheet: 'planets',
            name: "defaultname",
            frame: Math.floor((Math.random() * 10)),
            population:0,
            player:0,
            pop_label:undefined,
            pop_label_container:undefined,
            dragging:false,
            spawned_ship:undefined,
            collisionLayer:Q.SPRITE_ENEMY,
            collisionMask:Q.SPRITE_ENEMY,
            my_turn:true,
            growth:Math.floor((Math.random() * 10) + 1)
        });
        this.on("drag");
        this.on("touchEnd");
        this.add('2d');
    },
    inc_pop: function() {
        if (this.p.player != 0) {
            this.p.population += this.p.growth;
        }
    },
    step: function (dt) {
        this.p.pop_label_container.p.x = this.p.x;
        this.p.pop_label_container.p.y = this.p.y;
        this.p.pop_label.p.label = this.p.population + "";
        this.p.pop_label_container.fit();
    },
    drag: function(touch) {
        let stage = Q.stage(0);
        if (!this.p.dragging && this.p.population > 0 && this.p.player == 1 && this.p.my_turn) {
            this.p.dragging = true;
            this.p.spawned_ship = stage.insert(new Q.Ship({x:touch.x, y:touch.y}));
        } else {
            if (this.p.spawned_ship != undefined) {
                this.p.spawned_ship.p.angle = Math.atan2(touch.x - touch.origX, - (touch.y - touch.origY) )*(180/Math.PI);
                this.p.spawned_ship.p.x = touch.x;
                this.p.spawned_ship.p.y = touch.y;
                //DETECTION PART
                let temp_vm = this;
                stage.items.forEach(function(thing) {
                    if (thing.p.sheet == 'planets') {
                        if (((temp_vm.p.spawned_ship.p.x < (thing.p.x + 32)) && temp_vm.p.spawned_ship.p.x > (thing.p.x - 32)) 
                            && ((temp_vm.p.spawned_ship.p.y < (thing.p.y + 32)) && temp_vm.p.spawned_ship.p.y > (thing.p.y - 32))) {
                            //WE'RE ABOVE A PLANET
                            
                            if (thing != temp_vm) {
                               //IT'S NOT THE SAME PLANET AS THE START PLANET
                                thing.p.pop_label_container.p.fill = "white";
                            }
                            
                        } else {
                            thing.p.pop_label_container.p.fill = "#424242";
                        }
                    }
                });
            }
        }
    },
    touchEnd: function(touch) {
        this.p.dragging = false;
        let stage = Q.stage(0);
        if (this.p.spawned_ship != undefined) {
            let temp_vm = this;
            stage.items.forEach(function(thing) {
                if (thing.p.sheet == 'planets') {
                    if (thing.p.pop_label_container.p.fill == "white") {
                        //SELECTED PLANET
                        thing.p.pop_label_container.p.fill = "#424242";
                        //SHOW POPUP FOR ATTACK AND STORE EVERY DATA NEEDED TO EVENTUALLY RESOLVE ATTACK
                        let distance = (Math.abs(thing.p.x - temp_vm.p.x) + Math.abs(thing.p.y - temp_vm.p.y));
                        stage.current_attack = {
                            from : temp_vm,
                            to : thing,
                            distance : distance,
                            duration : Math.ceil( distance / temp_vm.p.spawned_ship.p.speed)
                        };
                        document.getElementById("full_background_atk").classList.remove("hide");
                        document.getElementById("attack_form").classList.remove("hide");
                        document.getElementById("attack_menu").classList.remove("hide");
                        document.getElementById("attack_start").value = temp_vm.p.name;
                        document.getElementById("attack_target").value = thing.p.name;
                        document.getElementById("attack_start_pop_max").value = temp_vm.p.population;
                        document.getElementById("attack_target_pop").value = thing.p.population;
                        document.getElementById("attack_pop").value = 1;
                        document.getElementById("attack_pop").min = 1;
                        document.getElementById("attack_pop").max = temp_vm.p.population;
                        document.getElementById("arrival").value = stage.current_attack.duration + " tours";
                    } else {
                        //NOTHING, NO PLANET SELECTED
                    }
                }
            });
            this.p.spawned_ship.destroy();
        }
    }
});

Q.Sprite.extend('Ship', {
    init: function (p) {
        this._super(p, {
            sheet: 'spaceship',
            frame: 0,
            population:0,
            player:0,
            speed:250,
            dest_pos:[0,0],
            my_turn:false,
            collisionLayer:Q.SPRITE_NONE,
            collisionMask:Q.SPRITE_NONE,
            remain_turns:10,
            pop_label:undefined,
            pop_label_container:undefined,
            destination_planet:undefined
        });

        this.add('2d');
    },
    step: function (dt) {
        if (this.p.pop_label_container != undefined) {
            this.p.pop_label_container.p.x = this.p.x;
            this.p.pop_label_container.p.y = this.p.y - 20;
            this.p.pop_label_container.fit();
        }
        if (this.p.my_turn && this.p.remain_turns > 0) {
            dir = [
                this.p.dest_pos[0] - this.p.x,
                this.p.dest_pos[1] - this.p.y
            ];
            hyp = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1]);
            dir[0] = dir[0] / hyp;
            dir[1] = dir[1] / hyp;
            this.p.x += dir[0] * this.p.speed;
            this.p.Y += dir[1] * this.p.speed;
            this.p.my_turn = false;
            this.p.remain_turns -= 1;
            if (this.p.remain_turns == 0) {
                console.log("finished_turns");
                if (this.p.destination_planet != undefined) {
                    //NEED TO BETTER HANDLE BATTLE RESOLUTION, REFERENCES ARE NOT EXACTLY KEPT, SO POPULATION CHANGES ARE NOT REPERCUTED. REWORK IS NEEDED
                    if (this.p.destination_planet.p.player == this.p.player) {
                        this.p.destination_planet.p.population += this.p.population;
                        console.log("allied planet reached, population transfered");
                    } else {
                        if (this.p.population > this.p.destination_planet.p.population) {
                            this.p.destination_planet.p.population = this.p.population - this.p.destination_planet.p.population;
                            this.p.destination_planet.p.player = this.p.player;
                            this.p.destination_planet.pop_label.p.color = this.p.pop_label.p.color;
                            //Need to verify if planet was neutral, then create labels etc... need to think about what might need to be implemented for this !
                            console.log("ennemy planet reached, won battle");
                        } else {
                            if (this.p.population == this.p.destination_planet.p.population) {
                                console.log("no winner, planet becomes neutral");
                            } else {
                                console.log("lost battle");
                            }
                        }
                    }
                }
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
});