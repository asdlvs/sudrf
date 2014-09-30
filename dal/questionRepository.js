var TDS = require('tedious'),
    config = require('./dbConfig');

module.exports = (function () {
    function QuestionRepository() {
        this.config = config;
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
                var roles = [];
                for (var i = 0; i < rowcount; i += 1) {
                    var row = rows[i],
                        id = row[0].value,
                        value = row[1].value;

                    roles.push({
                        id: id,
                        value: value
                    });
                }
                callback(roles);
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

    QuestionRepository.prototype.answer = function(obj){
        if (obj.answer === -1) {
            return
        }

        var cnn = new TDS.Connection(this.config);
        cnn.on('connect', function(err) {
            if (err) {
                throw err;
            }
            var answerCmd = 'INSERT INTO [dbo].[Results] ([PersonGuid], [QuestionId], [AnswerId])'
                + ' VALUES (@guid, @question, @answer)';

            var answerRequest = new TDS.Request(answerCmd, function(err) {
                if (err) {
                    throw err;
                }
            });

            answerRequest.addParameter('guid', TDS.TYPES.UniqueIdentifier, obj.guid);
            answerRequest.addParameter('question', TDS.TYPES.Int, obj.question);
            answerRequest.addParameter('answer', TDS.TYPES.Int, obj.answer);

            cnn.execSql(answerRequest);
        });
    };

    QuestionRepository.prototype.updateNumber = function(guid, number) {
        var cnn = new TDS.Connection(this.config);
        cnn.on('connect', function(err) {
            if (err) {
                throw err;
            }
            var updatecountCmd = 'UPDATE [dbo].[Persons] SET QuestionNumber = @number WHERE Guid = @guid';
            var updateRequest = new TDS.Request(updatecountCmd, function (err) {
                if (err) {
                    throw err;
                }
            });

            updateRequest.addParameter('number', TDS.TYPES.Int, number + 1);
            updateRequest.addParameter('guid', TDS.TYPES.UniqueIdentifier, guid);
            cnn.execSql(updateRequest);
        });
    };

    return QuestionRepository;
})();