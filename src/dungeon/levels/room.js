/**
 * 
 */
var Room = cc.Node.extend({
    enterListeners:[],
    exitListeners:[],

    /**
     * @param x
     * @param y
     * @param w
     * @param h
     */
    ctor:function(x, y, w, h) {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.rect = cc.rect(x, y, w, h);

        this.enterListeners = [];
        this.exitListeners = [];

        return true;
    },

    /**
     * 
     */
    onEnter:function() {
        for (var i=0; i<this.enterListeners.length; ++i) {
            this.enterListeners[i](this);
        }
    },

    /**
     * 
     */
    onExit:function() {
        for (var i=0; i<this.exitListeners.length; ++i) {
            this.exitListeners[i](this);
        }
    }
});
