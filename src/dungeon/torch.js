/**
 * 
 */
var Torch = cc.Sprite.extend({
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
        cc.spriteFrameCache.addSpriteFrames(res.Torch_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.Torch_png);
        this.addChild(this.spriteSheet);

        // 2. init runningAction
        var animFrames = [];
        for (var i=0; i<Torch.NUM_FRAMES; ++i) {
            animFrames.push(cc.spriteFrameCache.getSpriteFrame("torch" + i));
        }

        var animation = new cc.Animation(animFrames, 0.1);
        this.runningAction = new cc.RepeatForever(new cc.Animate(animation));
        this.sprite = new cc.Sprite("#torch0");
        this.sprite.texture.setAliasTexParameters();
        this.sprite.runAction(this.runningAction);
        this.spriteSheet.addChild(this.sprite);

//        this.setContentSize(this.sprite.getContentSize().width*this.sprite.getScale(), this.sprite.getContentSize().width*this.sprite.getScale());

//        var dn = new cc.DrawNode();
//        dn.drawRect(cc.p(0, 0), cc.p(this.getContentSize().width, this.getContentSize().height), cc.color(255, 255, 255, 0), 3, cc.color(0, 64, 0, 255));
//        this.addChild(dn);
    }
});

Torch.NUM_FRAMES = 8;
