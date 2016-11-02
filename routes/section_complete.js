exports.sectionComplete = function (req, res) {
    
    var testID = req.query.test_id;
     var section_id = req.query.section_id;
     var candidate_id = req.query.candidate_id;
  
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
                    memcached.get(username, function(err, result) {

                    if (err) {
                        console.error(err)
                    };
                    console.dir(result);
                    if (result == passcode) {
                        // perform get of all interviews
                            connection.end();
                            sectionCompleteFunction();
                    } else {
                    
                        if (result == '' || result == undefined) {

                             var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        sectionCompleteFunction();
                                        
                                    }
                                }});
                                connection.end(); 
                    }
                  }
         });
    }


    function sectionCompleteFunction(callback){
    		// get count of sections
    		var query = 'UPDATE Test_Admin_' + testID + ' SET currently_on_section = '+section_id+' WHERE candidate_id = '+candidate_id+';';
            connectionTo_TEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
           
            res.end(200);
            connectionTo_TEST_MACRO.end();
        	}});
    }
}
