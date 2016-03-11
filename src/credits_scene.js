/**
 * 
 */
var CreditsButton = cc.Layer.extend({
    touchRecognizer:null,

    /**
     * 
     */
    ctor:function() {
        //////////////////////////////
        // 1. super init first
        this._super();

        var creditsSprite = new cc.Sprite(res.CreditsButton_png, cc.rect(0, 0, 32, 32), false);
        creditsSprite.texture.setAliasTexParameters();
        creditsSprite.setScale(3.0);
        creditsSprite.setNormalizedPosition(cc.p(0.5, 0.6));
        this.addChild(creditsSprite);

        var creditsLabel = new cc.LabelTTF("Credits", "upheavtt", 16, cc.size(cc.winSize.width, 16), cc.TEXT_ALIGNMENT_CENTER);
        creditsLabel.setColor(cc.color(255, 255, 255, 255));
        creditsLabel.setNormalizedPosition(cc.p(0.5, 0.15));
//        creditsLabel.texture.setAliasTexParameters();
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

/**
 * 
 */
var CreditsOverlayLayer = cc.LayerColor.extend({
    ctor:function() {
        //////////////////////////////
        // 1. super init first
        this._super(cc.color(0, 0, 0, 0));

        var backButton = new BackButton();
        backButton.setPosition(50, cc.winSize.height - 50);
        backButton.setScale(3.0);
        this.addChild(backButton);

        return true;
    }
});

/**
 * 
 */
var CreditsScrollingLayer = cc.Layer.extend({
    currentPosition:null,
    scrollSpeed:50.0,
    font:"upheavtt",

    ctor:function() {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.currentPosition = cc.p(cc.winSize.width/2, -16);

        // concept
        this.addCategory("Concept");
        this.addCredit("Original Concept", ["Charles Marshall"]);

        // programming
        this.addCategory("Programming");
        this.addCredit("Lead Programmer", ["Charles Marshall"]);

        // testing
        this.addCategory("Testing");
        this.addCredit("Lead Tester", ["Charles Marshall"]);
        this.addCredit("Additional Testing", ["Alexander Marshall", "Brynna Marshall"]);

        // special thanks
        this.addCategory("Special Thanks");
        this.addCredit("Special Thanks To...", ["Nathan Schwarz", "Emily Schwarz", "Vedant Bedekar", "Alec Khatib"]);

        this.scheduleUpdate();

        return true;
    },

    /**
     * @param categoryName
     */
    addCategory:function(categoryName) {
        // category
        var categoryLabel = new cc.LabelTTF(categoryName, this.font, 32, cc.size(cc.winSize.width, 32), cc.TEXT_ALIGNMENT_CENTER);
        categoryLabel.setColor(cc.color(255, 255, 255, 255));
        categoryLabel.setPosition(this.currentPosition);
        categoryLabel.texture.setAliasTexParameters();
        this.addChild(categoryLabel);

        this.currentPosition = cc.pSub(this.currentPosition, cc.p(0, 48));
    },

    /**
     * @param creditRole
     * @param creditName
     */
    addCredit:function(creditRole, creditNames) {
        // credit role
        var creditRoleLabel = new cc.LabelTTF(creditRole, this.font, 32, cc.size(cc.winSize.width, 32), cc.TEXT_ALIGNMENT_CENTER);
        creditRoleLabel.setColor(cc.color(255, 255, 0, 255));
        creditRoleLabel.setPosition(this.currentPosition);
        creditRoleLabel.texture.setAliasTexParameters();
        this.addChild(creditRoleLabel);
        this.currentPosition = cc.pSub(this.currentPosition, cc.p(0, 24));

        // credit name
        for (var i=0; i<creditNames.length; ++i) {
            var creditNameLabel = new cc.LabelTTF(creditNames[i], this.font, 32, cc.size(cc.winSize.width, 32), cc.TEXT_ALIGNMENT_CENTER);
            creditNameLabel.setColor(cc.color(0, 255, 255, 255));
            creditNameLabel.setPosition(this.currentPosition);
            creditNameLabel.texture.setAliasTexParameters();
            this.addChild(creditNameLabel);
            this.currentPosition = cc.pSub(this.currentPosition, cc.p(0, 24));
        }
        this.currentPosition = cc.pSub(this.currentPosition, cc.p(0, 32));
    },

    /**
     * 
     * @param dt
     * @returns
     */
    update:function(dt) {
        this.setPosition(cc.pAdd(this.getPosition(), cc.p(0, this.scrollSpeed*dt)));
    }
});

/**
 * 
 */
var CreditsScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var scrollingLayer = new CreditsScrollingLayer();
        this.addChild(scrollingLayer);
        var overlayLayer = new CreditsOverlayLayer();
        this.addChild(overlayLayer);
    }
});
