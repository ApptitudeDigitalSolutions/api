exports.logout = function (req, res) {
    var usersname = req.body.username;
    var passcode = req.body.passcode;
    var isValid = 0;

    function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
    }

    
    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});



    async.series([function(callback) {
            logoutUser(callback);
    }]);

    function logoutUser(callback) {
                    memcached.get(username, function(err, result) {

                    if (err) {
                        console.error(err)
                    };
                    console.dir(result);
                    if (result == passcode) {
                        memcached.del(passcode, function(err) {
                            // perform logout 
                        });
                        
                    } else {
                    
                        if (result == '' || result == undefined) {

                                var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        // perform logout 
                                        var query2 = 'UPDATE Users SET passcode = NULL WHERE username =\'' + username + '\';';
                                        connection.query(query2, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                                            res.send(200);
                                            connection.end();
                                        }});
                                    }
                                }});
                    }
                  }
                });

    }
}
