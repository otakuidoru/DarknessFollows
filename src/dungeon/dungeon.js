/**
 *
 */
var Dungeon = cc.Node.extend({
    seed:0,

    /**
     * @param {Number} seed
     */
    ctor:function(seed) {
        //////////////////////////////
        // 1. super init first
        this._super();

        // 2. initialize member variables
        this.seed = seed;

        return true;
    },

    /**
     * 
     */
    getActiveSector: function() {
    }
});

Dungeon.SEED = "42";
