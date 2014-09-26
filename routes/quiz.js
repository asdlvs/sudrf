var express = require('express');
var router = express.Router();
var QuestionRepository = require('../dal/questionRepository');

router.route('/send').post(function (req, res) {
    console.log(req.body.answers);
    res.send(req.body.answers);
});

router.route('/').post(function (req, res) {
    var qr = new QuestionRepository();
    qr.questions(req.body.roleId, function (data) {
        res.render('quiz',
            {
                questions: data.length,
                data: JSON.stringify(data),
                firstname: req.body.firstname,
                lastname: req.body.lastname
            });
    });
});


module.exports = router;
