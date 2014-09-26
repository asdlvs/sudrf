var TDS = require('tedious');

module.exports = (function () {
    function QuestionRepository() {
        this.config = {
            userName: 'asdlvs@jozqeasimj.database.windows.net',
            password: '12345666Qa!',
            server: 'jozqeasimj.database.windows.net',
            options: {
                database: 'sudrf',
                rowCollectionOnRequestCompletion: true,
                encrypt: true
            }
        };
    };

    QuestionRepository.prototype.roles = function (callback) {
        var cnn = new TDS.Connection(this.config);
        cnn.on('connect', function (err) {
            if (err) {
                throw err;
            }
            var query = 'SELECT [R].[Id], [R].[Name] FROM [dbo].[Roles] as [R]';
            cnn.execSql(new TDS.Request(query, function (err, rowcount, rows) {
                if (err) {
                    throw err;
                }
                callback(rows);
            }));
        });
    };

    QuestionRepository.prototype.questions = function (roleId, callback) {
        var cnn = new TDS.Connection(this.config);
        cnn.on('connect', function (err) {
            if (err) {
                throw err;
            }
            var query = 'exec [dbo].[GetQuiz] @roleId';
            var request = new TDS.Request(query, function (err, rowcount, rows) {
                if (err) {
                    throw err;
                }

                var grouped = [],
                    index = -1,
                    id;

                for (var i = 0; i < rowcount; i += 1) {
                    var row = rows[i],
                        qid = row[0].value,
                        qorder = row[1].value,
                        qtext = row[2].value,
                        aid = row[3].value,
                        atext = row[4].value;

                    if (!id || id != qid) {
                        index += 1;
                        grouped[index] = {
                            id: qid,
                            text: qtext,
                            order: qorder,
                            answers: []
                        };
                        id = qid;
                    }
                    grouped[index].answers.push({
                        id: aid,
                        text: atext
                    });
                }


                callback(grouped);
            });
            request.addParameter('roleId', TDS.TYPES.Int, roleId)
            cnn.execSql(request);
        });
    };

    QuestionRepository.prototype.save = function(obj, callback) {
        var roleId = obj.roleId,
            firstname = obj.firstname,
            lastname = obj.lastname,
            answers = JSON.parse("[" + obj.answers + "]");

        
    };

    return QuestionRepository;
})();