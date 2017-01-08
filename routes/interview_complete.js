exports.completion = function (req, res) {
    var candidate_id =req.body.candidate_id;
    var username = req.body.username;
    var passcode = req.body.passcode;
    var ac_id = req.params.ac_id; 
  
    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var connectionTo_TEST_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'AC_MACRO' });
    connectionTo_TEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var async = require('async');
    async.series([function(callback) {
                   auth(callback);
    }]);

    function auth(callback) {
                  var Memcached = require('memcached');
                  var memcached = new Memcached('localhost:11211');
                    memcached.get(username, function(err, result) {

                    if (err) {
                        console.error(err)
                    };
                    console.dir(result);
                    if (result == passcode) {
                        // perform get of all interviews
                            connection.end();
                            addAnswer();
                    } else {
                    
                        if (result == '' || result == undefined) {

                             var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        addAnswer();
                                        
                                    }
                                }});
                                connection.end();

                            
                    }
                  }
         });
    }


    function addAnswer(callback){
    		// get count of sections
    		var query = 'UPDATE Assessment_Center_candidates_'+ac_id+' SET completed_activities = concat(\'i,\',completed_activities) WHERE id = \''+candidate_id+'\';';
            console.log(query);
            connectionTo_TEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

                 
                  res.writeHead(200, {
                      "Content-Type": "application/json"
                  });
                  var json = JSON.stringify({success:1});
                  console.log('TEST STATE IS ........................... ' + json);
                  res.end(json);
                  connectionTo_TEST_MACRO.end();
        	}});
    }
}
