/**
 * 
 */
var Warrior = Unit.extend({
    spriteSheet : null,
    sprite : null,
    // animations
    walkNorthAnimation : null,
    walkSouthAnimation : null,
    walkWestAnimation : null,
    walkEastAnimation : null,

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
        cc.spriteFrameCache.addSpriteFrames(res.Warrior_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.Warrior_png);
        this.addChild(this.spriteSheet);

        // 2. init walking animations
        this.walkNorthAnimation = this._initAnimationWalk("walk_north_", Warrior.FRAME_DELAY);
        this.walkSouthAnimation = this._initAnimationWalk("walk_south_", Warrior.FRAME_DELAY);
        this.walkWestAnimation = this._initAnimationWalk("walk_west_", Warrior.FRAME_DELAY);
        this.walkEastAnimation = this._initAnimationWalk("walk_east_", Warrior.FRAME_DELAY);

        this.sprite = new cc.Sprite("#walk_south_1");
        this.sprite.texture.setAliasTexParameters();
        this.spriteSheet.addChild(this.sprite);
        this.setContentSize(this.sprite.getContentSize().width*this.sprite.getScale(), this.sprite.getContentSize().width*this.sprite.getScale());
    },

    /**
     * @param {string} animationName
     * @param {number} delay
     */
    _initAnimationWalk:function(animationName, delay) {
        var animFrames = [
            cc.spriteFrameCache.getSpriteFrame(animationName + "0"),
            cc.spriteFrameCache.getSpriteFrame(animationName + "1"),
            cc.spriteFrameCache.getSpriteFrame(animationName + "2"),
            cc.spriteFrameCache.getSpriteFrame(animationName + "1")
        ];
        return new cc.Animation(animFrames, delay);
    },

    /**
     * 
     */
    walkNorth:function() {
        this._walk(this.walkNorthAnimation, 0, Level.TILE_SIZE);
    },

    /**
     * 
     */
    walkSouth:function() {
        this._walk(this.walkSouthAnimation, 0, -Level.TILE_SIZE);
    },

    /**
     * 
     */
    walkWest:function() {
        this._walk(this.walkWestAnimation, -Level.TILE_SIZE, 0);
    },

    /**
     * 
     */
    walkEast:function() {
        this._walk(this.walkEastAnimation, Level.TILE_SIZE, 0);
    },

    /**
     * @param animation
     * @param dx
     * @param dy
     */
    _walk:function(animation, dx, dy) {
        this.sprite.runAction(cc.spawn(
            new cc.Animate(animation),
            new cc.MoveBy(Warrior.TIME_TO_WALK, cc.p(dx, dy))
        ));
    }
});

Warrior.NUM_FRAMES_WALK = 3;
Warrior.TIME_TO_WALK = 1.0;
Warrior.FRAME_DELAY = Warrior.TIME_TO_WALK / 3.0;
