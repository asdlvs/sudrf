var Controller = (function () {
    function Controller(questions, guid, number) {
        this.timer = new Timer(60);
        this.quiz = new Quiz(questions, number);
        this.notifier = new Notifier(guid);
        this.prefix = 'timer_';
        this.guid = guid;
    };

    var doc = document,
        template = doc.getElementById('template').innerHTML,
        output = doc.getElementById('content');

    Controller.prototype.execute = function () {
        var self = this,
            timerBlock = doc.getElementById(self.prefix + self.quiz.index),
            btn = doc.getElementById('next'),
            nextHandler = function () {
                var answer = doc.querySelector('input[name="answer"]:checked');
                answer = answer && answer.value;
                self.quiz.answer(answer);

                self.notifier.answer(self.quiz.getQuestion().id, answer);

                self.timer.reset();
                timerBlock.classList.remove('timer-active');
                timerBlock.classList.add('timer-end');
                timerBlock.innerHTML = 'x';
                var question = self.quiz.next();
                if (question) {
                    self.execute();
                } else {
                    var xhr = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : (XMLHttpRequest && new XMLHttpRequest()) || null;
                    xhr.open('POST', '/quiz/last', false);
                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    xhr.send('guid='+ self.guid);
                    document.location = '/result';
                }
            },
            prepare = function() {
                if(self.quiz.index > 0) {
                    for(var i = 0, length = self.quiz.index; i < length; i += 1) {
                        var finished = doc.getElementById(self.prefix + i);
                        finished.classList.add('timer-end');
                        finished.innerHTML = 'x';
                    }
                }

                self.notifier.next(self.quiz.index);
            };

        prepare();

        output.innerHTML = Mustache.render(template, self.quiz.getQuestion());
        timerBlock.classList.add('timer-active');
        timerBlock.innerHTML = this.timer.seconds;

        self.timer.remove('tick');
        this.timer.on('tick', function (value) {
            timerBlock.innerHTML = value;
        });

        self.timer.remove('end');
        this.timer.on('end', nextHandler);

        var nextBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(nextBtn, btn);
        nextBtn.addEventListener('click', nextHandler, false);

        self.timer.start();
    };


    return Controller;
})();

