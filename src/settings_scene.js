/**
 * 
 */
var SettingsButton = cc.Sprite.extend({
    /**
     * 
     */
    ctor:function() {
        //////////////////////////////
        // 1. super init first
    	this._super(res.SettingsButton_png, cc.rect(0, 0, 16, 16), false);
    	this.texture.setAliasTexParameters();

    	this.touchRecognizer = new TouchRecognizer(this);
        this.touchRecognizer.listeners.push(function() {
            cc.director.pushScene(new SettingsScene());
        });

        return true;
    }
});

/**
 * 
 */
var SettingsLayer = cc.Layer.extend({
    font:"upheavtt",

    ctor:function() {
        //////////////////////////////
        // 1. super init first
        this._super();

        return true;
    }
});

/**
 * 
 */
var SettingsScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var settingsLayer = new SettingsLayer();
        this.addChild(settingsLayer);
    }
});
