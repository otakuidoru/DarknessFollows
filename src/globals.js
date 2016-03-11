/**
 *
 */

var zp = zp || {};

zp.globals = {};
zp.globals.COMPLETED_INSTADEATH = "COMPLETED_INSTADEATH";
zp.globals.PREVIOUSLY_LAUNCHED = "PREVIOUSLY_LAUNCHED";

/**
 * @returns
 */
zp.globals.isCompletedInstaDeath = function() {
    return zp.globals._getValue(zp.globals.COMPLETED_INSTADEATH);
};

/**
 * @param value
 */
zp.globals.setCompletedInstaDeath = function(value) {
    zp.globals._setValue(zp.globals.COMPLETED_INSTADEATH, value);
};

/**
 * @returns
 */
zp.globals.isPreviouslyLaunched = function() {
    return zp.globals._getValue(zp.globals.PREVIOUSLY_LAUNCHED);
};

/**
 * @param value
 */
zp.globals.setPreviouslyLaunched = function(value) {
    zp.globals._setValue(zp.globals.PREVIOUSLY_LAUNCHED, value);
};

/**
 * @param key
 */
zp.globals._getValue = function(key) {
    if (!cc.sys.localStorage.getItem(key)) {
        return null;
    }
    return JSON.parse(cc.sys.localStorage.getItem(key));
};

/**
 * @param key
 * @param value
 */
zp.globals._setValue = function(key, value) {
    cc.sys.localStorage.setItem(key, JSON.stringify(value));
};

/**
 * @returns
 */
zp.globals.toString = function() {
    var str = "";
    str += "\"" + zp.globals.COMPLETED_INSTADEATH + "\" = " + zp.globals.isCompletedInstaDeath() + "\n";
    str += "\"" + zp.globals.PREVIOUSLY_LAUNCHED + "\" = " + zp.globals.isPreviouslyLaunched() + "\n";
    return str;
};
