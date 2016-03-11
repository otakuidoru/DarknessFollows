/*
 * 
 */

var zp = zp || {};

/**
 *
 */
zp.PlayerClass = {
    WARRIOR : 1,
    MAGE    : 2,
    ROGUE   : 3
};

/**
 * 
 */
var Player = Unit.extend({
    playerClass : null,
    oldX : 0,
    oldY : 0,

    playerName : null,

    spriteSheet : null,
    sprite : null,

    // animations
    idleNorthAnimation : null,
    idleSouthAnimation : null,
    idleWestAnimation  : null,
    idleEastAnimation  : null,
    walkNorthAnimation : null,
    walkSouthAnimation : null,
    walkWestAnimation  : null,
    walkEastAnimation  : null,

    currentAction : null,

    direction : null,

    /**
     * @param layer
     * @param playerClass
     */
    ctor:function(layer, playerClass) {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.layer = layer;
        this.playerClass = playerClass;
        this.oldX = 0;
        this.oldY = 0;

        this.playerName = "Hiro Nounverber";

        this.currentAction = null;
        this.direction = zp.Direction.SOUTH;

        // 1. create sprite sheet
        switch (this.playerClass) {
            case zp.PlayerClass.WARRIOR: {
                cc.spriteFrameCache.addSpriteFrames(res.Warrior_plist);
                this.spriteSheet = new cc.SpriteBatchNode(res.Warrior_png);
            } break;
        }
        this.addChild(this.spriteSheet);

        // 2. init animations
        this.idleNorthAnimation = this._initAnimationIdle("walk_north_", Player.FRAME_DELAY);
        this.idleSouthAnimation = this._initAnimationIdle("walk_south_", Player.FRAME_DELAY);
        this.idleWestAnimation  = this._initAnimationIdle("walk_west_",  Player.FRAME_DELAY);
        this.idleEastAnimation  = this._initAnimationIdle("walk_east_",  Player.FRAME_DELAY);

        this.walkNorthAnimation = this._initAnimationWalk("walk_north_", Player.FRAME_DELAY);
        this.walkSouthAnimation = this._initAnimationWalk("walk_south_", Player.FRAME_DELAY);
        this.walkWestAnimation  = this._initAnimationWalk("walk_west_",  Player.FRAME_DELAY);
        this.walkEastAnimation  = this._initAnimationWalk("walk_east_",  Player.FRAME_DELAY);

        this.sprite = new cc.Sprite("#walk_south_1");
        this.sprite.texture.setAliasTexParameters();
        this.spriteSheet.addChild(this.sprite);
        this.setContentSize(
            this.sprite.getContentSize().width*this.sprite.getScale(),
            this.sprite.getContentSize().height*this.sprite.getScale()
        );

        this.setAnchorPoint(cc.p(0.0, -0.06));

//        this.scheduleUpdate();

        return true;
    },

    /**
     * @param {string} animationName
     * @param {number} delay
     */
    _initAnimationIdle:function(animationName, delay) {
        var animFrames = [
            cc.spriteFrameCache.getSpriteFrame(animationName + "1")
        ];
        var animation = new cc.Animation(animFrames, delay);
        animation.retain();
        return animation;
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
        var animation = new cc.Animation(animFrames, delay);
        animation.retain();
        return animation;
    },

    /**
     * @returns
     */
    walkNorth:function() {
        this.direction = zp.Direction.NORTH;
    	return this._walk(this.walkNorthAnimation, 0, 1);
    },

    /**
     * @returns
     */
    walkSouth:function() {
        this.direction = zp.Direction.SOUTH;
    	return this._walk(this.walkSouthAnimation, 0, -1);
    },

    /**
     * @returns
     */
    walkWest:function() {
        this.direction = zp.Direction.WEST;
        return this._walk(this.walkWestAnimation, -1, 0);
    },

    /**
     * @returns
     */
    walkEast:function() {
        this.direction = zp.Direction.EAST;
        return this._walk(this.walkEastAnimation, 1, 0);
    },

    /**
     * @param animation
     * @param dx
     * @param dy
     * @returns
     */
    _walk:function(animation, dx, dy) {
        this.stopAction(this.currentAction);
        this.currentAction = this.sprite.runAction(cc.repeatForever(cc.animate(animation)));
        this.sprite.runAction(cc.moveBy(Player.MOVE_SPEED, dx*Level.TILE_SIZE, dy*Level.TILE_SIZE));
        return this.currentAction;
    },

    /**
     * 
     */
    stopWalking:function() {
        this.stopAction(this.currentAction);
        switch (this.direction) {
            case zp.Direction.NORTH: {
                this.currentAction = this.sprite.runAction(cc.repeatForever(cc.animate(this.idleNorthAnimation)));
            } break;
            case zp.Direction.SOUTH: {
                this.currentAction = this.sprite.runAction(cc.repeatForever(cc.animate(this.idleSouthAnimation)));
            } break;
            case zp.Direction.WEST:  {
                this.currentAction = this.sprite.runAction(cc.repeatForever(cc.animate(this.idleWestAnimation)));
            } break;
            case zp.Direction.EAST:  {
                this.currentAction = this.sprite.runAction(cc.repeatForever(cc.animate(this.idleEastAnimation)));
            } break;
        }
    },

    /**
     * @param newPosOrxValue
     * @param yValue
     */
    setPosition:function(newPosOrxValue, yValue) {
        this.oldX = this.getPositionX();
        this.oldY = this.getPositionY();

        this._super(newPosOrxValue, yValue);

        var dx = newPosOrxValue - this.oldX;
        var dy = yValue - this.oldY;

        this.layer.setPosition(
            cc.winSize.width/2 + this.layer.getPositionX() - dx * Level.SCALE,
            cc.winSize.height/2 + this.layer.getPositionY() - dy * Level.SCALE
        );
    },

    onExit:function() {
        this.idleNorthAnimation.release();
        this.idleSouthAnimation.release();
        this.idleWestAnimation.release();
        this.idleEastAnimation.release();

        this.walkNorthAnimation.release();
        this.walkSouthAnimation.release();
        this.walkWestAnimation.release();
        this.walkEastAnimation.release();
    }

//    /**
//     * @param dt
//     */
//    update:function(dt) {
//        this._super(dt);
//    }
});

Player.MOVE_SPEED = 0.4;
Player.NUM_FRAMES_WALK = 4;
Player.FRAME_DELAY = Player.MOVE_SPEED / 3.0;
