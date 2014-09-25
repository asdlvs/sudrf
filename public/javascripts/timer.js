var Timer = (function () {
    function Timer(seconds) {
        this.seconds = seconds;
        this.stay = seconds;
        this.handlers = [];
    };

    var delegate = function (name, params) {
        var self = this;
        this.handlers[name].forEach(function (handler) {
            handler.apply(self, params);
        });
    };

    Timer.prototype.on = function (key, handler) {
        if (!this.handlers[key]) {
            this.handlers[key] = [];
        }
        this.handlers[key].push(handler);
    };

    Timer.prototype.remove = function(key) {
        this.handlers[key] = [];
    };

    Timer.prototype.start = function() {
        var self = this;
        self.intervalId = setInterval(function() {
            self.stay -= 1;
            delegate.call(self, 'tick', [self.stay]);
            if(!self.stay) {
                clearInterval(self.intervalId);
                delegate.call(self, 'end');
            }
        }, 1000);
    };

    Timer.prototype.reset = function() {
        this.stay = this.seconds;
        clearInterval(this.intervalId);
    };

    return Timer;
})();