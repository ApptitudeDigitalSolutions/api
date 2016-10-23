exports.addParticipant = function (req, res) {
    var usersname = req.body.username;
    var passcode = req.body.passcode;
    var testID = req.query.test_id; 


    var first = req.body.first;
    var last = req.body.last;
    var email = req.body.email;
    var DoB = req.body.dob;
    var other = req.body.other;
  
    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var connectionTo_TEST_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'TEST_MACRO' });
    connectionTo_TEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});



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
                            addNewParticipant();
                    } else {
                    
                        if (result == '' || result == undefined) {

                             var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        addNewParticipant();
                                        
                                    }
                                }});
                                connection.end(); 
                    }
                  }
         });
    }


    function addNewParticipant(callback){
    		// get count of sections
    		var query = 'INSERT INTO Test_applicants_'+testID+' (Frist,Last,Email,DoB,min_stage_of_test,test_stage_state,other) VALUES (\''+first+'\',\''+last+'\',\''+email+'\',\''+DoB+'\',0,\'none\',\''+other+'\');';
            connectionTo_TEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
           
            res.end(200);
            connectionTo_TEST_MACRO.end();
        	}});
    }
}
