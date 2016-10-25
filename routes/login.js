exports.login = function (req, res) {
    var username = req.body.email;
    var password = req.body.password;
    var isValid = 0;
    var companyID = '';

    function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
    }

    var passcode = randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    
    var async = require('async');
    async.series([function(callback) {
            loginUser(callback);
    }]);

    function loginUser(callback) {
            var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
            connection.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                    for (var i in rows) {
                        var Memcached = require('memcached');
                        var memcached = new Memcached('localhost:11211');
                        Memcached.config.poolSize = 25;
                        storedhash = rows[i].password;
                        companyID = rows[i].company_id;
                        memcached.set(username, passcode, 300, function(err, result) {
                            if (err) console.error(err);
                            console.dir(result);
                        });
                        var bcrypt = require('bcrypt');
                        if (bcrypt.compareSync(password, storedhash) == true) {
                            isAUser = 1;
                        }

                    }

                    if (isAUser == 1) {

                        var updateQuery = 'UPDATE Users SET passcode = \'' + passcode + '\' WHERE username =\'' + username + '\';';
                        connection.query(updateQuery, function(err, rows) {if (err) {return;} else {
                                       
                            res.writeHead(200, {
                                "Content-Type": "application/json"
                            });
                            var json = JSON.stringify({
                                passcode: passcode,
                                company_id:companyID
                            });
                            res.end(json);
                            
                          }});

                        connection.end();

                    }else{
                        connection.end();
                    }
            }
        
    });

}

}
