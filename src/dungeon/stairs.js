/**
 * 
 */
var StairsUp = cc.Sprite.extend({
    enterListeners:[],
    exitListeners:[],

    ctor:function() {
        //////////////////////////////
        // 1. super init first
    	this._super(res.Tiles_png, cc.rect(0, 16, 16, 16), false);
    	this.texture.setAliasTexParameters();
    	this.setAnchorPoint(0.5, 0.5);

        return true;
    },

    fireEntered:function() {
        for (var i=0; i<this.enterListeners.length; ++i) {
            this.enterListeners[i]();
        }
    },

    fireExited:function() {
        for (var i=0; i<this.exitListeners.length; ++i) {
            this.exitListeners[i]();
        }
    }
});

/**
 * 
 */
var StairsDown = cc.Sprite.extend({
    enterListeners:[],
    exitListeners:[],

    ctor:function() {
        //////////////////////////////
        // 1. super init first
    	this._super(res.Tiles_png, cc.rect(50, 25, 25, 25), false);
    	this.texture.setAliasTexParameters();
    	this.setAnchorPoint(0.5, 0.5);

        return true;
    },

    fireEntered:function() {
        for (var i=0; i<this.enterListeners.length; ++i) {
            this.enterListeners[i]();
        }
    },

    fireExited:function() {
        for (var i=0; i<this.exitListeners.length; ++i) {
            this.exitListeners[i]();
        }
    }
});
