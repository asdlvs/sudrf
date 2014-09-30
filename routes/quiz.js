var express = require('express');
var router = express.Router();
var qr = new (require('../dal/questionRepository'))(),
    pr = new (require('../dal/personRepository'))();

router.route('/last').post(function (req, res) {
    pr.last(req.body.guid);
    res.send(null);
});

router.route('/answer').post(function (req, res) {
    qr.answer({
        guid: req.body.guid,
        question: req.body.question,
        answer: JSON.parse(req.body.answer) || -1
    });
    res.send(null);
});

router.route('/next').post(function (req, res) {
    qr.updateNumber(req.body.guid, parseInt(req.body.number));
    res.send(null);
});

router.route('/').post(function (req, res) {

    var getQuiz = function (user) {
        qr.questions(req.body.roleId, function (data) {
            res.render('quiz',
                {
                    questions: data.length,
                    data: JSON.stringify(data),
                    firstname: user.firstname,
                    lastname: user.lastname,
                    guid: user.guid,
                    number: user.number
                });
        });
    };

    pr.getUser(req.body.guid, function (user) {
        if (!user) {
            pr.nameExists(req.body.firstname, req.body.lastname, req.body.fathername, function (exists) {
                if (exists) {
                    res.render('Already', {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        fathername: req.body.fathername
                    });
                } else {
                    pr.newUser(req.body, getQuiz);
                }
            });
        } else {
            getQuiz(user);
        }
    });

});


module.exports = router;
