require([], function () {

    Q.Sprite.extend('Planet', {
        init: function (p) {
            this._super(p, {
                //THINGS
            });
        },

        step: function (dt) {
            //Called every frame
        }
    });
    
    Q.Sprite.extend('Ship', {
        init: function (p) {
            this._super(p, {
                //THINGS
            });
        },

        step: function (dt) {
            //Called every frame
        }
    });
    
});