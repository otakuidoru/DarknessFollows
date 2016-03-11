/**
 * 
 */
var MainMenuLayer = cc.Layer.extend({
    /**
     * 
     */
    ctor:function() {
        //////////////////////////////
        // 1. super init first
        this._super();

        // background
        var background = new cc.Sprite(res.Title_png, cc.rect(0, 0, 800, 450));
        background.setNormalizedPosition(0.5, 0.5);
        background.texture.setAliasTexParameters();

//        var shader = new cc.GLProgram(res.Gray_vsh, res.Gray_fsh);
//        shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
//        shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
//        shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
//        shader.link();
//        shader.updateUniforms();
//        background.setShaderProgram(shader);
//        shader.use();
//        this.addChild(background);
////        cc.log(shader.getFragmentShaderLog());
////        cc.log(shader.getVertexShaderLog());

        var leftTorch = new Torch();
        leftTorch.setScale(10.0);
        leftTorch.setPosition(cc.winSize.width/8, 2*cc.winSize.height/3);
        this.addChild(leftTorch);

        var rightTorch = new Torch();
        rightTorch.setScale(10.0);
        rightTorch.setPosition(7*cc.winSize.width/8, 2*cc.winSize.height/3);
        this.addChild(rightTorch);

        // new game button
//        var normal = cc.textureCache.getTextureForKey(res.NewGameButton_png);
//        if (!normal) {
//            normal = cc.loader.loadImg(res.NewGameButton_png);
//            normal.setAliasTexParameters();
//            cc.textureCache.cacheImage(res.NewGameButton_png, normal);
//        }

//        var selected = cc.textureCache.getTextureForKey(res.NewGameButton_png);
//        selected.setAliasTexParameters();
//        var disabled = cc.textureCache.getTextureForKey(res.NewGameButton_png);
//        disabled.setAliasTexParameters();
        var newGameButton = new ccui.Button(res.NewGameButton_png, res.NewGameButton_png, res.NewGameButton_png, ccui.Widget.LOCAL_TEXTURE);
//        newGameButton._buttonNormalRenderer._texture.setAliasTexParameters();
//        newGameButton._buttonClickedRenderer._texture.setAliasTexParameters();
//        newGameButton._buttonDisableRenderer._texture.setAliasTexParameters();
        newGameButton.setScale(3.0);
        newGameButton.setTouchEnabled(true);
        newGameButton.setPressedActionEnabled(false);
        newGameButton.addTouchEventListener(function(sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_BEGAN: break;
                case ccui.Widget.TOUCH_ENDED:
                    cc.director.runScene(new cc.TransitionFade(0.5, new PlayerClassSelectionScene(), cc.color(0, 0, 0, 255)));
                    break;
                default: break;
            }
        }, this);
        newGameButton.setPosition(cc.winSize.width/4, cc.winSize.height/4);
        this.addChild(newGameButton);

//        var creditsButton = new CreditsButton();
//        creditsButton.attr({
//            x:3*cc.winSize.width/4,
//            y:cc.winSize.height/6
//        });
//        this.addChild(creditsButton);

//        var rankingsButton = new CreditsButton();
//        rankingsButton.attr({x:200, y:200});
//        this.addChild(rankingsButton);

        return true;
    }
});

/**
 * 
 */
var MainMenuScene = cc.Scene.extend({
    /**
     * 
     */
    onEnter:function() {
        this._super();
        var layer = new MainMenuLayer();
        this.addChild(layer);
    }
});
