exports.answerQuestion = function (req, res) {

    var answer = req.body.answer;
    var timeOnQuestion = "1000";
    var testID = req.params.test_id; 
    var candidate_email = req.body.candidate_email;
    var correct_answer = req.body.correct_answer;
    var question_id = req.body.question_id; 
    var section_id = req.body.section_id; 
    var candidate_id = 0;
    var was_correct = 0;
    if(correct_answer == answer){
        was_correct = 1;
    }

  
    var mysql = require('mysql');
    var connectionTEST_MACRO = mysql.createConnection({ host: req.app.locals.TEST_MACRO_DB_HOST, user: req.app.locals.TEST_MACRO_DB_USER, password: req.app.locals.TEST_MACRO_DB_PASSWORD, database: req.app.locals.TEST_MACRO_DB_NAME });
    connectionTEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var async = require('async');
    async.series([function(callback) {
            authenticateAsParticipant(callback);
    }]);


    function authenticateAsParticipant(callback) {
         var query = 'SELECT * FROM Test_applicants_'+testID+' WHERE email =\'' + candidate_email + '\';';
            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
        
                if (rows.length > 0){
                    candidate_id = rows[0].id;
                    answerQuestionFunction();
                    
                }else{
                    res.end(401);
                }
            }});
           
                   
    }


    function answerQuestionFunction(callback){
    		// get count of sections
    		var query = 'INSERT INTO Test_results_'+testID+' (candidate_id,candidate_email,question_id,section_id,answer,was_correct,time_taken_on_question,time_answered) VALUES (\''+candidate_id+'\',\''+candidate_email+'\','+question_id+','+section_id+',\''+answer+'\','+was_correct+','+timeOnQuestion+',NOW());';
            console.log(query);
            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

                var query2 = 'UPDATE Test_admin_'+testID+' SET `currently_on_question` = '+ question_id +', `currently_on_section` = ' + section_id + ' WHERE candidate_email = \'' + candidate_email +'\';';
                  console.log(query2);
                  connectionTEST_MACRO.query(query2, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                 
                  res.writeHead(200, {
                      "Content-Type": "application/json"
                  });
                  var json = JSON.stringify({success:1});
                  console.log('TEST STATE IS ........................... ' + json);
                  res.end(json);
                  connectionTEST_MACRO.end();

                }});

        	}});
    }
}
