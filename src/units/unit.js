/**
 * 
 */
var Unit = cc.Sprite.extend({
    hp:0,
    mp:0,

    // experience
    xp:0,
    xpLevel:0,

    // personal attributes
    body:0,
    mind:0,
    spirit:0,

    /**
     * 
     */
    ctor:function(fileName, rect, rotated) {
        //////////////////////////////
        // 1. super init first
        this._super(fileName, rect, rotated);

//        this.scheduleUpdate();

        return true;
    },

    /**
     * @param dt
     */
    update:function(dt) {
        this._super(dt);
    }
});
