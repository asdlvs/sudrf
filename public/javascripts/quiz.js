var Quiz = (function() {
    function Quiz(questions, index) {
        this.questions = questions;
        this.count = questions.length;
        this.index = index || 0;
        this.answers = [];
    };

    Quiz.prototype.getQuestion = function() {
      return this.questions[this.index];
    };

    Quiz.prototype.next = function() {
        if(this.index++ < this.count) {
            return this.getQuestion();
        }
        return null;
    };

    Quiz.prototype.answer = function(answer) {
        this.answers[this.index] = answer;
    };

    return Quiz;
})();