exports.getTime = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var isValid = 0;

    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


    var async = require('async');
    async.series([function(callback) {
            getTimeFunction(callback);
    }]);

    function getTimeFunction(callback) {
                  var Memcached = require('memcached');
                  var memcached = new Memcached('localhost:11211');
                    memcached.get(username, function(err, result) {

                    if (err) {
                        console.error(err)
                    };
                    console.dir(result);
                    if (result == passcode) {
                        // perform getTime

						var currentTime = Math.round(new Date().getTime() / 1000.0);
		                var stringTimeConvert = parseInt(currentTime);
		                res.writeHead(200, {
		                    "Content-Type": "application/json"
		                });
		                var json = JSON.stringify({
		                    time: stringTimeConvert
		                });
		                res.end(json);
        
                    } else {
                    
                        if (result == '' || result == undefined) {

                                var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        // perform getTime 
                                        var currentTime = Math.round(new Date().getTime() / 1000.0);
						                var stringTimeConvert = parseInt(currentTime);
						                res.writeHead(200, {
						                    "Content-Type": "application/json"
						                });
						                var json = JSON.stringify({
						                    time: stringTimeConvert
						                });
						                res.end(json);
                                        
                                    }
                                }});
                                connection.end();
                    }
                  }
                });

    }
}
