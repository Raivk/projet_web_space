Q.Sprite.extend('Planet', {
    init: function (p) {
        this._super(p, {
            sheet: 'planets',
            frame: Math.floor((Math.random() * 10)),
            population:0,
            player:0,
            pop_label:undefined,
            pop_label_container:undefined,
            dragging:false,
            spawned_ship:undefined,
            collisionLayer:Q.SPRITE_ENEMY,
            collisionMask:Q.SPRITE_ENEMY,
            my_turn:true
        });
        this.on("drag");
        this.on("touchEnd");
        this.add('2d');
    },
    step: function (dt) {
        this.p.pop_label_container.p.x = this.p.x;
        this.p.pop_label_container.p.y = this.p.y;
        this.p.pop_label.label = this.p.population + "";
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
                            
                            if (thing.p.player != temp_vm.p.player) {
                               //IT'S AN ENEMY PLANET
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
                        stage.current_attack = {
                            from : temp_vm,
                            to : thing
                        };
                        document.getElementById("attack_menu").classList.remove("hide");
                        //
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
            speed:0,
            dest_pos:[0,0],
            my_turn:false,
            collisionLayer:Q.SPRITE_NONE,
            collisionMask:Q.SPRITE_NONE
        });

        this.add('2d');
    },
    step: function (dt) {
        if (this.p.my_turn) {
            dir = [
                this.p.dest[0] - this.p.x,
                this.p.dest[1] - this.p.y
            ];
            hyp = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1]);
            dir[0] = dir[0] / hyp;
            dir[1] = dir[1] / hyp;
            this.p.x += dir[0] * this.p.speed;
            this.p.Y += dir[1] * this.p.speed;
            this.p.my_turn = false;
        }
    }
});