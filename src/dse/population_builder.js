/**
 *
 */

var zp = zp || {};

/**
 * @param prng
 * @param world
 */
zp.PopulationBuilder = function(prng, world) {
    this.prng = prng;
    this.world = world;
    this.numDays = 0;
};

/**
 * 
 */
zp.PopulationBuilder.run() {
    var worldPopulationIds = [];

    for (var d=0; d<this.numDays; ++d) {
        // run each day
        var cc.sys.localStorage.getItem(key);
        cc.sys.localStorage.setItem(key, JSON.stringify(value));
    }
};
