var express = require('express'),
    router = express.Router(),
    QuestionRepository = require('../dal/questionRepository'),
    guid = require('node-uuid');

/* GET users listing. */
router.get('/', function(req, res) {
    var qr = new QuestionRepository();
    qr.roles(function(roles) {
        res.render('register', { roles: roles, guid: guid.v1() });
    });
});

module.exports = router;
