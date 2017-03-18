Q.Sprite.extend('Planet', {
    init: function (p) {
        this._super(p, {
            sheet: 'planets',
            frame: Math.floor((Math.random() * 10)),
            population:0,
            player:0,
            pop_label:undefined,
            pop_label_container:undefined
        });

        this.add('2d');
    },
    step: function (dt) {
        this.p.pop_label_container.p.x = this.p.x;
        this.p.pop_label_container.p.y = this.p.y;
        this.p.pop_label.label = this.p.population + "";
        this.p.pop_label_container.fit();
    }
});