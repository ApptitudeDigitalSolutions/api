exports.reset_test = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var testID = req.params.test_id; 
    var pageNumber = req.body.page_number;
  
    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var connectionTo_TEST_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'TEST_MACRO' });
    connectionTo_TEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var async = require('async');
    async.series([function(callback) {
            authenticate(callback);
    }]);

    function authenticate(callback) {
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
                            nextSectionFunction();
                    } else {
                    
                        if (result == '' || result == undefined) {

                             var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        nextSectionFunction();
                                        
                                    }
                                }});
                                connection.end(); 
                    }
                  }
         });
    }


    function nextSectionFunction(callback){
            // get count of sections
            var query = 'UPDATE Test_applicants_'+testID+' SET min_page_of_test = 0; UPDATE ';
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
