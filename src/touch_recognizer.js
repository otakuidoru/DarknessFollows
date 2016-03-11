/**
 * 
 */
function TouchRecognizer(node) {
    this.valid = false;
    this.listeners = [];

    var self = this;
    if (true || 'touches' in cc.sys.capabilities) { // touches work on mac but return false
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,

            /**
             * @param touch
             * @param event
             */
            onTouchBegan: function(touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    self.valid = true;
                    return true;
                }

                return false;
            },

            /**
             * @param touch
             * @param event
             */
            onTouchMoved: function(touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if (!cc.rectContainsPoint(rect, locationInNode)) {
                	self.valid = false;
                }
            },

            /**
             * @param touch
             * @param event
             */
            onTouchEnded: function(touch, event) {
                if (self.valid) {
                    var target = event.getCurrentTarget();
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);

                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        for (var i=0; i<self.listeners.length; ++i) {
                            self.listeners[i]();
                        }
                    }
                }
            }
        }), node);
    } else {
        cc.log("TOUCH_ONE_BY_ONE is not supported");
    }
};

/**
 * @param func
 */
TouchRecognizer.addListener = function(func) {
    this.listeners.push(func);
};
