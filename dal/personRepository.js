var TDS = require('tedious'),
    config = require('./dbConfig');

module.exports = (function () {
    var UserRepository = function () {
        this.config = config;
    };

    UserRepository.prototype.newUser = function (user, callback) {
        var cnn = new TDS.Connection(this.config);
        cnn.on('connect', function (err) {
            if (err) {
                throw err;
            }
            var cmd = "INSERT INTO [dbo].[Persons] "
                + "(Firstname, Lastname, Fathername, Guid, Phone, Mail, Place)"
                + "VALUES (@Firstname, @Lastname, @Fathername, @Guid, @Phone, @Mail, @Place)";

            var request = new TDS.Request(cmd, function (err) {
                if (err) {
                    throw err;
                }
                user.number = 0;

                callback(user);
            });

            request.addParameter('Firstname', TDS.TYPES.NVarChar, user.firstname.trim());
            request.addParameter('Lastname', TDS.TYPES.NVarChar, user.lastname.trim());
            request.addParameter('Fathername', TDS.TYPES.NVarChar, user.fathername.trim());
            request.addParameter('Guid', TDS.TYPES.UniqueIdentifier, user.guid);
            request.addParameter('Phone', TDS.TYPES.NVarChar, user.phone);
            request.addParameter('Mail', TDS.TYPES.NVarChar, user.mail);
            request.addParameter('Place', TDS.TYPES.NVarChar, user.place);

            cnn.execSql(request);
        });
    };

    UserRepository.prototype.getUser = function (guid, callback) {
        var cnn = new TDS.Connection(this.config);
        cnn.on('connect', function (err) {
            if (err) {
                throw err;
            }

            var cmd = "SELECT [Id], [Firstname], [Lastname], [Fathername], [Guid], [Phone], [Mail], [Place], [QuestionNumber]"
                + " FROM [dbo].[Persons] WHERE Guid = @Guid";
            var request = new TDS.Request(cmd, function (err, rowcount, rows) {
                if (err) {
                    throw err;
                }

                var userRow = rows[0];

                callback(rowcount && {
                    id: userRow[0].value,
                    firstname: userRow[1].value,
                    lastname: userRow[2].value,
                    fathername: userRow[3].value,
                    guid: userRow[4].value,
                    phone: userRow[5].value,
                    mail: userRow[6].value,
                    place: userRow[7].value,
                    number: userRow[8].value
                })
            });

            request.addParameter('Guid', TDS.TYPES.UniqueIdentifier, guid);
            cnn.execSql(request);
        });
    };

    UserRepository.prototype.nameExists = function(firstname, lastname, fathername, phone, callback) {
        var cnn = new TDS.Connection(this.config);
        cnn.on('connect', function(err) {
            if (err) {
                throw err;
            }

            var cmd = "SELECT * FROM [dbo].[Persons] WHERE Firstname = @firstname AND Lastname = @lastname AND Fathername = @fathername AND Phone = @phone";
            var request = new TDS.Request(cmd, function(err, rowcount) {
                if (err) {
                    throw err;
                }

                callback(!!rowcount);
            });

            request.addParameter('firstname', TDS.TYPES.NVarChar, firstname);
            request.addParameter('lastname', TDS.TYPES.NVarChar, lastname);
            request.addParameter('fathername', TDS.TYPES.NVarChar, fathername);
            request.addParameter('phone', TDS.TYPES.NVarChar, phone);

            cnn.execSql(request);
        });
    };

    UserRepository.prototype.last = function(guid) {
        var cnn = new TDS.Connection(this.config);
        cnn.on('connect', function(err) {
            if (err) {
                throw err;
            }

            var cmd = "UPDATE [dbo].[Persons] SET IsFinished = 1 WHERE Guid = @guid";
            var request = new TDS.Request(cmd, function(err) {
                if (err) {
                    throw err;
                }
            });

            request.addParameter('guid', TDS.TYPES.UniqueIdentifier, guid);
            cnn.execSql(request);
        });
    };

    return UserRepository;
})();