var Notifier = (function() {
    function Notifier(guid) {
        this.guid = guid;
        this.xhr = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : (XMLHttpRequest && new XMLHttpRequest()) || null;
    }

    Notifier.prototype.answer = function(question, answer) {
        this.xhr.open('POST', '/quiz/answer', false);
        this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        this.xhr.send('question=' + question + '&answer=' + answer + '&guid=' + this.guid);
    };

    Notifier.prototype.next = function(number) {
        this.xhr.open('POST', '/quiz/next', false);
        this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        this.xhr.send('guid=' + this.guid + '&number=' + number);
    };

    return Notifier;
})();
