/**
 * 
 */
var GelatinousCube = Unit.extend({
    spriteSheet : null,
    runningAction : null,
    sprite : null,

    /**
     * 
     */
    ctor:function() {
        //////////////////////////////
        // 1. super init first
    	this._super();
        this.init();

        return true;
    },

    /**
     * 
     */
    init:function() {
        this._super();

        // 1. create sprite sheet
        cc.spriteFrameCache.addSpriteFrames(res.GelatinousCube_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.GelatinousCube_png);
        this.addChild(this.spriteSheet);

        // 2. init runningAction
        var animFrames = [];
        for (var i=0; i<GelatinousCube.NUM_WALK_FRAMES; ++i) {
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("walk" + i));
        }

        var animation = new cc.Animation(animFrames, 0.1);
        this.runningAction = new cc.RepeatForever(new cc.Animate(animation));
        this.sprite = new cc.Sprite("#walk0");
        this.sprite.texture.setAliasTexParameters();
        this.sprite.setScale(2.0);
        this.sprite.runAction(this.runningAction);
        this.spriteSheet.addChild(this.sprite);

        this.setContentSize(this.sprite.getContentSize().width*this.sprite.getScale(), this.sprite.getContentSize().width*this.sprite.getScale());
    }
});

GelatinousCube.NUM_WALK_FRAMES = 24;
