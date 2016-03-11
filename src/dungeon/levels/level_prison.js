/**
 * @see http://silentmatt.com/biginteger-docs/files/biginteger-js.html#BigInteger.BigInteger
 */
var PrisonLevel = Level.extend({
    numPrisonCells:0,

    /**
     * @param num
     */
    ctor:function(num) {
        //////////////////////////////
        // 1. super init first
        this._super(num);

        return true;
    }
});
