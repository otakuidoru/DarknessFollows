/**
 * 
 */
var VampireBat = Unit.extend({
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
        cc.spriteFrameCache.addSpriteFrames(res.VampireBat_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.VampireBat_png);
        this.addChild(this.spriteSheet);

        // 2. init runningAction
        var animFrames = [];
        for (var i=0; i<VampireBat.NUM_WALK_FRAMES; ++i) {
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("vampire_bat" + i));
        }

        var animation = new cc.Animation(animFrames, 0.1);
        this.runningAction = new cc.RepeatForever(new cc.Animate(animation));
        this.sprite = new cc.Sprite("#vampire_bat0");
        this.sprite.texture.setAliasTexParameters();
        this.sprite.setScale(Sector.SCALE);
        this.sprite.runAction(this.runningAction);
        this.spriteSheet.addChild(this.sprite);

        this.setContentSize(this.sprite.getContentSize().width*this.sprite.getScale(), this.sprite.getContentSize().width*this.sprite.getScale());
    }
});

VampireBat.NUM_WALK_FRAMES = 2;
