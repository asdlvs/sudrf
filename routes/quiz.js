var express = require('express');
var router = express.Router();
var QuestionRepository = require('../dal/questionRepository');
/* GET users listing. */
router.get('/', function(req, res) {
    var qr = new QuestionRepository();
    qr.questions(1, function(data) {
        res.render('quiz', { questions: data.length, data: JSON.stringify(data) });
    });
});

module.exports = router;
