exports.getTestSchedule = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var company_id = req.params.company_id; 

    var isValid = 0;

  
    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var connectionTo_TEST_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'TEST_MACRO' });
    connectionTo_TEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


    var async = require('async');
    async.series([function(callback) {
            getTestScheduleFunction(callback);
    }]);

    function getTestScheduleFunction(callback) {
                    
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
                            formatJsonForAllTests();
                    } else {
                    
                        if (result == '' || result == undefined) {

                             var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        formatJsonForAllTests(callback);
                                        
                                    }
                                }});
                                connection.end();

                            
                    }
                  }
         });
    }


    function formatJsonForAllTests(callback){

            var query = 'SELECT * FROM Test_templates WHERE company_id =\'' + company_id + '\';';
            
            connectionTo_TEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

            var objToStringify = {tests:[]};
            console.log(rows);
            for(i in rows){
                var test = {
                    test_id: rows[i].id,
                    test_title: rows[i].test_title,
                    to_be_conducted_on: rows[i].to_be_conducted_on,
                    participants_count: rows[i].participants_count
                };

                var x = objToStringify.tests.length;
                objToStringify.tests[x] = test;
            }

            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            var json = JSON.stringify(objToStringify);
            console.log('the Json block sent looks like : ' + json);
            res.end(json);
            
        }});
        connectionTo_TEST_MACRO.end();
    }
}
