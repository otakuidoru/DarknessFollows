/**
 * 
 */
var TreasureChest = cc.Sprite.extend({
    openListeners:[],

    ctor:function() {
        //////////////////////////////
        // 1. super init first
    	this._super(res.TreasureChest_png, cc.rect(0, 0, 16, 16), false);
    	this.texture.setAliasTexParameters();

        return true;
    },

    /**
     * 
     */
    open:function() {
        for (var i=0; i<this.openListeners.length; ++i) {
            this.openListeners[i]();
        }
    },
});
