/**
 * 
 */
var GameLayer = cc.Layer.extend({
    /**
     * 
     */
    ctor:function() {
        //////////////////////////////
        // 1. super init first
        this._super();

        var level = new Level(0);
        this.addChild(level, 0);

        var player = new Player(level, zp.PlayerClass.WARRIOR);
        level.setPlayer(player);

        return true;
    }
});

/**
 * 
 */
var GameScene = cc.Scene.extend({
    /**
     * 
     */
    onEnter:function() {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});
