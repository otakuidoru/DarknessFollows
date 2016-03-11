/**
 *
 */
var StandardGameController = cc.Node.extend({
    viewPoint:null,
    isZoomedOut:false,
    gameLayer:null,

	/**
     *
     */
    ctor:function() {
        this.viewPoint = cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
        this.isZoomedOut = false;
        this.gameLayer = null;
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
StandardGameController.getSharedSingleton = function() {
    if (!StandardGameController.INSTANCE) {
        StandardGameController.INSTANCE = new StandardGameController();
    }
    return StandardGameController.INSTANCE;
};
