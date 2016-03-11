/**
 *
 */
var HUDOverlay = cc.LayerColor.extend({
    /**
     * @param num
     */
    ctor:function(num) {
        // 1. initialize member variables
        this._super();
        this.setScale(Level.SCALE);

        return true;
    }
});
