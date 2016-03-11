/**
 * 
 */
var BackButton = cc.Sprite.extend({
    touchRecognizer:null,

    /**
     * 
     */
    ctor:function(onClickFunc) {
        //////////////////////////////
        // 1. super init first
    	this._super(res.BackButton_png, cc.rect(0, 0, 16, 16), false);
    	this.texture.setAliasTexParameters();

    	this.touchRecognizer = new TouchRecognizer(this);
        this.touchRecognizer.listeners.push(onClickFunc);

        return true;
    }
});
