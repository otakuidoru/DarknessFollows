/**
 * 
 */
var Door = cc.Sprite.extend({
	// event listeners
    openListeners:[],	
    closeListeners:[],
    enterListeners:[],
    exitListeners:[],

    /**
     * 
     */
    ctor:function() {
        //////////////////////////////
        // 1. super init first
    	this._super(res.Dungeon_Tiles_png, cc.rect(0, 0, 16, 16), false);
    	this.texture.setAliasTexParameters();

        return true;
    },

    /**
     * Opens this {@link Door}.
     */
    open:function() {
   	    for (var i=0; i<this.openListeners.length; ++i) {
            this.openListeners[i]();
        }
    },

    /**
     * Closes this {@link Door}.
     */
    close:function() {
        for (var i=0; i<this.closeListeners.length; ++i) {
            this.closeListeners[i]();
        }
    }
});
