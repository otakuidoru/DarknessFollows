/**
 * 
 */
var NewGameDifficultyLayer = cc.Layer.extend({
    currentPosition:null,
    backButton:null,

    /**
     * 
     */
    ctor:function(ctx) {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.setScale(3.0);

        this.currentPosition = cc.p(cc.winSize.width/2, cc.winSize.height/2);

        this.backButton = new BackButton(function() {
            cc.director.runScene(new cc.TransitionFade(0.5, new PlayerClassSelectionScene(), cc.color(0, 0, 0, 255)));
        });
        this.backButton.setAnchorPoint(0.0, 1.0);
        this.backButton.setNormalizedPosition(0.0, 1.0);
        this.backButton.setScale(this.getScale());
        this.addChild(this.backButton);

        switch (ctx.playerClass) {
            case zp.PlayerClass.WARRIOR: {	// Warrior
                this._addDifficultyLevel("NOT IN THE FACE", zp.PlayerClass.WARRIOR);
                this._addDifficultyLevel("BRING IT ON", zp.PlayerClass.WARRIOR);
                this._addDifficultyLevel("I AM THE REAPER", zp.PlayerClass.WARRIOR);
                this._addDifficultyLevel("INSTA-DEATH", zp.PlayerClass.WARRIOR);
                if (JSON.parse(cc.sys.localStorage.getItem("COMPLETED_INSTADEATH"))) {
                    this._addDifficultyLevel("SERIOUSLY, JUST GIVE UP", zp.PlayerClass.WARRIOR);	// Harder Than Hard
                } else {
                    this._addDifficultyLevel("???", zp.PlayerClass.WARRIOR);
                }
            } break;
            case zp.PlayerClass.MAGE: {		// Mage
                this._addDifficultyLevel("", zp.PlayerClass.MAGE);
                this._addDifficultyLevel("", zp.PlayerClass.MAGE);
                this._addDifficultyLevel("", zp.PlayerClass.MAGE);
                this._addDifficultyLevel("INSTA-DEATH", zp.PlayerClass.MAGE);
                if (JSON.parse(cc.sys.localStorage.getItem("COMPLETED_INSTADEATH"))) {
                    this._addDifficultyLevel("SERIOUSLY, JUST GIVE UP", zp.PlayerClass.MAGE);	// Harder Than Hard
                } else {
                    this._addDifficultyLevel("???", zp.PlayerClass.MAGE);
                }
            } break;
            case zp.PlayerClass.ROGUE: {	// Rogue
                this._addDifficultyLevel("I'M KNOWN AS \"7 FINGERS\"", zp.PlayerClass.ROGUE);	// I SLIP AND TRIP
                this._addDifficultyLevel("STEALTHY", zp.PlayerClass.ROGUE);
                this._addDifficultyLevel("LEAVE NO TRACE", zp.PlayerClass.ROGUE);	// GHOST IN THE NIGHT
                this._addDifficultyLevel("INSTA-DEATH", zp.PlayerClass.ROGUE);
                if (JSON.parse(cc.sys.localStorage.getItem("COMPLETED_INSTADEATH"))) {
                    this._addDifficultyLevel("SERIOUSLY, JUST GIVE UP", zp.PlayerClass.ROGUE);	// Harder Than Hard
                } else {
                    this._addDifficultyLevel("???", zp.PlayerClass.ROGUE);
                }
            } break;
        }

        return true;
    },

    /**
     * @param str
     * @param playerClass
     */
    _addDifficultyLevel:function(str, playerClass) {
        var button;
        switch (playerClass) {
            case zp.PlayerClass.WARRIOR: {	// Warrior
                button = new cc.Sprite(res.WarriorDifficultyButton_png, cc.rect(0, 0, 157, 16), false);
            } break;
            case zp.PlayerClass.MAGE: {		// Mage
                button = new cc.Sprite(res.MageDifficultyButton_png, cc.rect(0, 0, 157, 16), false);
            } break;
            case zp.PlayerClass.ROGUE: {	// Rogue
                button = new cc.Sprite(res.RogueDifficultyButton_png, cc.rect(0, 0, 157, 16), false);
            } break;
        }

        button.texture.setAliasTexParameters();
        button.setAnchorPoint(0.5, 0.5);
        button.setPosition(this.currentPosition);
        button.setContentSize(157/button.getScale(), 16/button.getScale());
        this.addChild(button);

        var dn = new cc.DrawNode();
        dn.drawRect(cc.p(0, 0), cc.p(button.getBoundingBox().width, button.getBoundingBox().height), cc.color(255, 255, 255, 0), 3, cc.color(0, 64, 0, 255));
        button.addChild(dn);

        button.touchRecognizer = new TouchRecognizer(this);
        button.touchRecognizer.listeners.push(function() {
            cc.director.runScene(new cc.TransitionFade(0.5, new GameScene(), cc.color(0, 0, 0, 255)));
        });

        var label = new cc.LabelTTF(str, "upheavtt", 16, cc.size(button.getBoundingBox().width, 16), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        label.setDimensions(button.getBoundingBox().width, button.getBoundingBox().height);
        label.setColor(cc.color(255, 255, 255, 255));
        label.setAnchorPoint(0.5, 0.5);
        label.setNormalizedPosition(0.5, 0.5);
        button.addChild(label);

        this.currentPosition = cc.pSub(this.currentPosition, cc.p(0, 24));
    }
});

/**
 * 
 */
var NewGameDifficultyScene = cc.Scene.extend({
    ctx:null,

    /**
     * 
     */
    ctor:function(ctx) {
        this._super();

        this.ctx = ctx;

        return true;
    },

    onEnter:function() {
        this._super();

        var newGameDifficultyLayer = new NewGameDifficultyLayer(this.ctx);
        this.addChild(newGameDifficultyLayer);
    }
});

/**
 * 
 */
var AbstractPlayerClassPanel = cc.Layer.extend({
    touchRecognizer:null,
    icon:null,
    descr:null,
    descrLabel:null,

    /**
     * 
     */
    ctor:function(ctx, iconImg, descr) {
        //////////////////////////////
        // 1. super init first
        this._super();

        const SCALE = 3.0;

        this.setContentSize(64*SCALE, 128*SCALE);
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));

        this.touchRecognizer = new TouchRecognizer(this);
        this.touchRecognizer.listeners.push(function() {
            cc.director.runScene(new cc.TransitionFade(0.5, new NewGameDifficultyScene(ctx), cc.color(0, 0, 0, 255)));
        });

        this.icon = new cc.Sprite(iconImg, cc.rect(0, 0, 64, 64), false);
    	this.icon.texture.setAliasTexParameters();
        this.icon.setScale(SCALE);
        this.icon.setAnchorPoint(0.5, 1.0);
        this.icon.setNormalizedPosition(cc.p(0.5, 1.0));
        this.addChild(this.icon);

        this.descr = descr;
        var descrLabel = new cc.LabelTTF(this.descr, "DarknessFollows", 14, cc.size(cc.winSize.width, this.getBoundingBox().height), cc.TEXT_ALIGNMENT_LEFT);
        descrLabel.setDimensions(this.getBoundingBox().width, this.getBoundingBox().height - this.icon.getBoundingBox().height);
        descrLabel.setColor(cc.color(255, 255, 255, 255));
        descrLabel.setAnchorPoint(0.5, 1.0);
        descrLabel.setPosition(cc.p(
            this.icon.getBoundingBox().x + this.icon.getBoundingBox().width/2,
            this.icon.getBoundingBox().y
        ));
//        descrLabel.texture.setAliasTexParameters();
        this.addChild(descrLabel);

        var dn = new cc.DrawNode();
        dn.drawRect(cc.p(0, 0), cc.p(this.getBoundingBox().width, this.getBoundingBox().height), cc.color(255, 255, 255, 0), 3, cc.color(0, 64, 0, 255));
        this.addChild(dn);

        return true;
    }
});

/**
 * 
 */
var WarriorPanel = AbstractPlayerClassPanel.extend({
    /**
     * 
     */
    ctor:function() {
        //////////////////////////////
        // 1. super init first
        this._super({playerClass:zp.PlayerClass.WARRIOR}, res.WarriorClassIcon_png, "While skilled in combat and able to make the most out of heavy armor and weaponry, the warrior is less able to learn and perform magic. Best used to smash your enemies at close range.");

        return true;
    }
});

/**
 * 
 */
var MagePanel = AbstractPlayerClassPanel.extend({
    /**
     * 
     */
    ctor:function() {
        //////////////////////////////
        // 1. super init first
        this._super({playerClass:zp.PlayerClass.MAGE}, res.MageClassIcon_png, "<INSERT MAGE DESC HERE>");

        return true;
    }
});

/**
 * 
 */
var RoguePanel = AbstractPlayerClassPanel.extend({
    /**
     * 
     */
    ctor:function() {
        //////////////////////////////
        // 1. super init first
        this._super({playerClass:zp.PlayerClass.ROGUE}, res.RogueClassIcon_png, "<INSERT ROGUE DESC HERE>");
        // nimble of finger and slight of hand, the rogue...

        return true;
    }
});

/**
 * 
 */
var PlayerClassSelectionLayer = cc.Layer.extend({
    backButton:null,
    warriorPanel:null,
    magePanel:null,
    roguePanel:null,

    /**
     * 
     */
    ctor:function() {
        //////////////////////////////
        // 1. super init first
        this._super();

        const SCALE = 3.0;

        this.backButton = new BackButton(function() {
            cc.director.runScene(new cc.TransitionFade(0.5, new MainMenuScene(), cc.color(0, 0, 0, 255)));
        });
        this.backButton.setAnchorPoint(0.0, 1.0);
        this.backButton.setNormalizedPosition(0.0, 1.0);
        this.backButton.setScale(SCALE);
        this.addChild(this.backButton);

        this.warriorPanel = new WarriorPanel();
        this.warriorPanel.setPosition(cc.p(cc.winSize.width/4, cc.winSize.height/2));
        this.addChild(this.warriorPanel);

        this.magePanel = new MagePanel();
        this.magePanel.setPosition(cc.p(2*cc.winSize.width/4, cc.winSize.height/2));
        this.addChild(this.magePanel);

        this.roguePanel = new RoguePanel();
        this.roguePanel.setPosition(cc.p(3*cc.winSize.width/4, cc.winSize.height/2));
        this.addChild(this.roguePanel);

        return true;
    }
});

/**
 * 
 */
var PlayerClassSelectionScene = cc.Scene.extend({
    /**
     * 
     */
    onEnter:function() {
        this._super();

        var playerClassSelectionLayer = new PlayerClassSelectionLayer();
        this.addChild(playerClassSelectionLayer);
    }
});

///**
// * 
// */
//var NewGameLayer = cc.Layer.extend({
//    backButton:null,
//
//    /**
//     * 
//     */
//    ctor:function() {
//        //////////////////////////////
//        // 1. super init first
//        this._super();
//
//        const SCALE = 3.0;
//
//        this.backButton = new BackButton(function() {
//            cc.director.runScene(new cc.TransitionFade(0.5, new MainMenuScene(), cc.color(0, 0, 0, 255)));
//        });
//        this.backButton.setPosition(100, 100);
//        this.backButton.setScale(SCALE);
//        this.addChild(this.backButton);
//
//        return true;
//    }
//});
//
///**
// * 
// */
//var NewGameScene = cc.Scene.extend({
//    /**
//     * 
//     */
//    onEnter:function() {
//        this._super();
//
//        var newGameLayer = new NewGameLayer();
//        this.addChild(newGameLayer);
//    }
//});
