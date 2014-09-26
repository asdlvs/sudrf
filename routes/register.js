var express = require('express');
var router = express.Router();
var QuestionRepository = require('../dal/questionRepository');

/* GET users listing. */
router.get('/', function(req, res) {
    var qr = new QuestionRepository();
    qr.roles(function(roles) {
        res.render('register', { roles: roles});
    });
});

module.exports = router;
