/**
 *
 */
var PlayerMoveController = cc.Node.extend({
    player:null,
    world:null,

	/**
     *
     */
    ctor:function() {
        this.player = null;
        this.world = null;
    },

    /**
     * @param x
     * @param y
     */
    setViewpointCenter:function(x, y) {
        var centerPoint = cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
        var point = cc.p(x, y);
        this.viewPoint = cc.pSub(centerPoint, point);
        cc.log("%s, %s", centerPoint.x, centerPoint.y);

//        // don't scroll so far so we see anywhere outside the visible map which would show up as black bars
//        if (point.x < centerPoint.x) {
//            this.viewPoint.x = 0;
//        }
//        if (point.y < centerPoint.y) {
//            this.viewPoint.y = 0;
//        }

        // while zoomed out, don't adjust the viewpoint
        if (!this.isZoomedOut) {
            this.gameLayer.setPosition(this.viewPoint);
        }
    }
});

/**
 * 
 */
PlayerMoveController.getSharedSingleton = function() {
    if (!PlayerMoveController.INSTANCE) {
    	PlayerMoveController.INSTANCE = new PlayerMoveController();
    }
    return PlayerMoveController.INSTANCE;
};
