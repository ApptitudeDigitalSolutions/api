exports.login = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var isAUser = 0;
    var companyID = '';
    var name = '';
    var endpoint = '';

    function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
    }

    var passcode = randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

    var mysql = require('mysql');
    var connectionMACRO = mysql.createConnection({ host: req.app.locals.USERS_DB_HOST, user: req.app.locals.USERS_DB_USER, password: req.app.locals.USERS_DB_PASSWORD, database: req.app.locals.USERS_DB_NAME});
    connectionMACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


    
    var async = require('async');
    async.series([function(callback) {
            loginUser(callback);
    }]);

    function loginUser(callback) {
            var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
            connectionMACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                    for (var i in rows) {
                        var Memcached = require('memcached');
                        var memcached = new Memcached('localhost:11211');
                        
                        storedhash = rows[i].password;
                        companyID = rows[i].company_id;
                        name = rows[i].first + " " + rows[i].last;
                        endpoint = "apptitudedigitalsolutions.com:8080";
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
                        connectionMACRO.query(updateQuery, function(err, rows) {if (err) {return;} else {
                                       
                            res.writeHead(200, {
                                "Content-Type": "application/json"
                            });
                            var json = JSON.stringify({
                                passcode: passcode,
                                company_id:companyID,
                                name: name,
                                endpoint:endpoint
                            });
                            res.end(json);
                            
                          }});

                        connectionMACRO.end();

                    }else{
                        connectionMACRO.end();
                    }
            }
        
    });

}

}
