/**
 * @see https://en.wikipedia.org/wiki/The_Thirty-Six_Dramatic_Situations
 */

var zp = zp || {};

/**
 *
 */
zp.QuestType = {
    DELIVERANCE : 0
};

/**
 * @param type
 */
zp.Quest = function(type) {
    this.type = type;
};

/**
 * 
 */
zp.DeliveranceQuest = function() {
    zp.Quest.call(this, zp.Quest.DELIVERANCE);

    this.threateners = new Set();
    this.unfortunates = new Set();
    this.rescuers = new Set();
};

zp.DeliveranceQuest.prototype = Object.create(Quest.prototype, {};
zp.DeliveranceQuest.prototype.constructor = zp.DeliveranceQuest;
