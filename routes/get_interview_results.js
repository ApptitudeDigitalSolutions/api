exports.getInterviewsResults = function (req, res) {
    var usersname = req.body.username;
    var passcode = req.body.passcode;
    var company_id = req.body.companyID; 
    var candidateID = req.query.candidate_id; 
    var interviewID = req.query.interview_id; 
  
    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var connectionTo_INTERVIEW_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'INTERVIEW_MACRO' });
    connectionTo_INTERVIEW_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


    var async = require('async');
    async.series([function(callback) {
            getInterviewResultsFunction(callback);
    }]);

    function getInterviewResultsFunction(callback) {
                    memcached.get(username, function(err, result) {

                    if (err) {
                        console.error(err)
                    };
                    console.dir(result);
                    if (result == passcode) {
                          connection.end();
                          formatJsonForInterviewResults();

                    } else {
                    
                        if (result == '' || result == undefined) {

                             var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        formatJsonForInterviewResults();
                                        
                                    }
                                }});
                                connection.end();
                           
                    }
                  }
         });
    }


    function formatJsonForInterviewResults(callback){


            var query = 'SELECT * FROM Interview_Review_Results_'+ interviewID +' WHERE candidate_id = \'' + candidateID + '\';';
            connectionTo_INTERVIEW_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

            var objToStringify = {review_results:[], audio_files:[]};

            for(i in rows){
                
                var review_result = {
                    review_question_id: rows[i].review_question_id,
                    review_answer_values: rows[i].review_answer_values,
                    review_answer_notes: rows[i].review_answer_notes
                };

                var x = objToStringify.review_results.length;
                objToStringify.review_results[x] = review_results;
            }



					var query = 'SELECT * FROM Interview_Results_'+ interviewID +' WHERE candidate_id = \'' + candidateID + '\';';
		            connectionTo_INTERVIEW_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

		            var objToStringify = {review_results:[], audio_files:[]};

		            for(j in rows){
		                
		                var audio_file = {
		                    question_id: rows[j].question_id,
		                    section_id: rows[j].section_id,
		                    wav_file_name: rows[j].answer_wav,
		                    answer_notes: rows[j].answer_notes
		                };

		                var x = objToStringify.audio_files.length;
		                objToStringify.audio_files[x] = audio_file;
		            }


		            res.writeHead(200, {
		                "Content-Type": "application/json"
		            });
		            var json = JSON.stringify(objToStringify);
		            console.log('the Json block sent looks like : ' + json);
		            res.end(json);
		            
		        }});
		        connectionTo_INTERVIEW_MACRO.end();

        }});
        connectionTo_INTERVIEW_MACRO.end();
    }
}
