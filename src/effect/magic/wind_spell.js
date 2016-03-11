/**
 * 
 */
var WindSpell = cc.Sprite.extend({
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
        cc.spriteFrameCache.addSpriteFrames(res.WindSpell_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.WindSpell_png);
        this.addChild(this.spriteSheet);

        // 2. init runningAction
        var animFrames = [];
        for (var i=0; i<WindSpell.NUM_FRAMES; ++i) {
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("wind_" + i));
        }

        var animation = new cc.Animation(animFrames, 0.05);
        this.runningAction = new cc.RepeatForever(new cc.Animate(animation));
        this.sprite = new cc.Sprite("#wind_0");
        this.sprite.texture.setAliasTexParameters();
        this.setAnchorPoint(cc.p(0.0, 0.0));

        this.setContentSize(
            this.sprite.getContentSize().width*this.sprite.getScale(),
            this.sprite.getContentSize().width*this.sprite.getScale()
        );
    },

    /**
     * 
     */
    run:function() {
        var self = this;
        this.sprite.runAction(this.runningAction);
        this.spriteSheet.addChild(this.sprite);
        this.runAction(new cc.Sequence([
            cc.delayTime(1.5),
            cc.callFunc(function(){
                self.removeFromParent();
            })
        ]));
    }
});

WindSpell.NUM_FRAMES = 30;
