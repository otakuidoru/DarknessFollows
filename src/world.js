

/**
 *
 */
var World = cc.Layer.extend({
    sections:[],

    /**
     *
     */
    ctor:function() {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setScale(3.0);

        // 2. initialize member variables
        this.sections = [];
        for (var i=0; i<this.sections.length; ++i) {
            this.sections[i] = new cc.TMXTiledMap();
        }

        return true;
    },

    /**
     * @param section
     */
    setNorthwest:function(section) {
        this._setSection(section, 0, -World.SECTION_SIZE, World.SECTION_SIZE);
    },

    /**
     * @param section
     */
    setNorth:function(section) {
        this._setSection(section, 1, 0, World.SECTION_SIZE);
    },

    /**
     * @param section
     */
    setNortheast:function(section) {
        this._setSection(section, 2, World.SECTION_SIZE, World.SECTION_SIZE);
    },

    /**
     * @param section
     */
    setWest:function(section) {
        this._setSection(section, 3, -World.SECTION_SIZE, 0);
    },

    /**
     * @param section
     */
    setCenter:function(section) {
        this._setSection(section, 4, 0, 0);
    },

    /**
     * @param section
     */
    setEast:function(section) {
        this._setSection(section, 5, World.SECTION_SIZE, 0);
    },

    /**
     * @param section
     */
    setSouthwest:function(section) {
        this._setSection(section, 6, -World.SECTION_SIZE, -World.SECTION_SIZE);
    },

    /**
     * @param section
     */
    setSouth:function(section) {
        this._setSection(section, 7, 0,-World.SECTION_SIZE);
    },

    /**
     * @param section
     */
    setSoutheast:function(section) {
        this._setSection(section, 8, World.SECTION_SIZE, -World.SECTION_SIZE);
    },

    /**
     * 
     */
    _setSection:function(newSection, sectionIndex, dx, dy) {
        // remove the existing child and cleanup first
        if (this.sections[sectionIndex]) {
            this.sections[sectionIndex].removeFromParent();
        }
        this.section[sectionIndex] = newSection;
        this.section[sectionIndex].setPosition(cc.p(dx, dy));
    },

//    /**
//     * 
//     */
//    getSectionIDForPosition:function(x, y) {
//        return { x:x/World.SECTION_SIZE };
//    }
});

World.SECTION_SIZE = Level.TILE_SIZE * Level.SIZE * Level.SCALE;
