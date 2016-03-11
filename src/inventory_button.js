/**
 * 
 */
var InventoryButton = cc.Layer.extend({
    touchRecognizer:null,

    /**
     * 
     */
    ctor:function() {
        //////////////////////////////
        // 1. super init first
        this._super();

        var creditsSprite = new cc.Sprite(res.CreditsButton_png, cc.rect(0, 0, 16, 16), false);
        creditsSprite.texture.setAliasTexParameters();
        creditsSprite.setScale(Sector.SCALE);
        creditsSprite.setNormalizedPosition(cc.p(0.5, 0.6));
        this.addChild(creditsSprite);

        var creditsLabel = new cc.LabelTTF("Credits", "upheavtt", 16, cc.size(cc.winSize.width, 16), cc.TEXT_ALIGNMENT_CENTER);
        creditsLabel.setColor(cc.color(255, 255, 255, 255));
        creditsLabel.setNormalizedPosition(cc.p(0.5, 0.15));
        creditsLabel.texture.setAliasTexParameters();
        this.addChild(creditsLabel);

        this.touchRecognizer = new TouchRecognizer(this);
        this.touchRecognizer.listeners.push(function() {
            cc.director.pushScene(new CreditsScene());
        });

        this.setContentSize(75, 75);

        var dn = new cc.DrawNode();
        this.addChild(dn);
        dn.drawRect(cc.p(0, 0), cc.p(this.getBoundingBox().width, this.getBoundingBox().height), cc.color(255, 255, 255, 0), 3, cc.color(0, 64, 0, 255));

        return true;
    }
});
