exports.answerQuestion = function (req, res) {

    var answer = req.body.answer;
    var timeOnQuestion = req.body.timeOnQuestion;
    var testID = req.query.test_id; 
    var candidate_id = req.query.candidate_id; 
    var question_id = req.query.question_id; 
    var section_id = req.query.section_id; 

  
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
                            answerQuestionFunction();
                    } else {
                    
                        if (result == '' || result == undefined) {

                             var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        answerQuestionFunction();
                                        
                                    }
                                }});
                                connection.end(); 
                    }
                  }
         });
    }


    function answerQuestionFunction(callback){
    		// get count of sections
    		var query = 'INSERT INTO Test_Results_'+testID+' (candidate_id,question_id,section_id,answer,was_correct,time_taken_on_question) VALUES (\''+candidate_id+'\','+question_id+','+section_id+','+answer+',NULL,'+timeOnQuestion+');';
            connectionTo_TEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
           
            res.end(200);
            connectionTo_TEST_MACRO.end();
        	}});
    }
}
