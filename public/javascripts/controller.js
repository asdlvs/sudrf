var Controller = (function () {
    function Controller(questions) {
        this.timer = new Timer(10);
        this.quiz = new Quiz(questions);
        this.prefix = 'timer_';
    };

    var  doc = document,
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
                self.timer.reset();
                timerBlock.classList.remove('timer-active');
                timerBlock.classList.add('timer-end');
                var question = self.quiz.next();
                if (question) {
                    self.execute();
                } else {
                    console.log(self.quiz.answers);
                }
            };

        output.innerHTML = Mustache.render(template, self.quiz.getQuestion());
        timerBlock.classList.add('timer-active');

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

