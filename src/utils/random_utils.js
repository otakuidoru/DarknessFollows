/**
 * @param seed
 */
var RandomUtils = function(seed) {
    this.prng = new MersenneTwister19937();
    this.prng.init_genrand(seed);
};

/**
 * @returns
 */
RandomUtils.prototype.randomBool = function() {
    return this.prng.genrand_res53() >= 0.5;
};

/**
 * @param min
 * @param max
 * @param inclusive
 * @returns
 */
RandomUtils.prototype.randomInt = function(min, max, inclusive) {
    if (typeof max === "undefined") {
        max = min;
        min = 0;
    }
    if (typeof inclusive === "undefined") {
        inclusive = false;
    }
    return Math.floor(this.prng.genrand_res53() * (max - min + (inclusive ? 1 : 0))) + min;
};

/**
 * @param min
 * @param max
 * @returns
 */
RandomUtils.prototype.randomOddInt = function(min, max, inclusive) {
    if (typeof max === "undefined") {
        max = min;
        min = 0;
    }
    if (max % 2 == 0) {
        --max;
    }
    if (min % 2 == 0) {
        ++min;
    }
    return Math.floor(min + 2 * Math.floor(this.prng.genrand_res53() * ((max - min) / 2 + (inclusive ? 1 : 0))));
};

/**
 * @param array
 * @see http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
RandomUtils.prototype.shuffleArray = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(this.prng.genrand_res53() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};
