exports.getInterviewsResults = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var company_id = req.body.companyID; 
    var candidateID = req.query.candidate_id; 
    var interviewID = req.query.interview_id; 
  
    var mysql = require('mysql');
    
     var connectionAC_MACRO = mysql.createConnection({ host: req.app.locals.AC_MACRO_DB_HOST, user: req.app.locals.AC_MACRO_DB_USER, password: req.app.locals.AC_MACRO_DB_PASSWORD, database: req.app.locals.AC_MACRO_DB_NAME });
    connectionAC_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


    var authenticate = require("./auth.js");
    authenticate.authenticate(username,passcode,req,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([formatJsonForInterviewResults], function (err, result) { console.log("DONE");  connectionAC_MACRO.end(); });
      }else{
          connectionAC_MACRO.end(); 
          if(!res.headersSent){
          res.writeHead(200, {
              "Content-Type": "application/json"
          });
          var json = JSON.stringify({
             status:"unauthorized"
              });
          res.end(json);
        }
      }
    });



    function formatJsonForInterviewResults(callback){


            var query = 'SELECT * FROM Interview_Review_Results_'+ interviewID +' WHERE candidate_id = \'' + candidateID + '\';';
            connectionAC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

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
		            connectionAC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

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
		        connectionAC_MACRO.end();

        }});
        connectionAC_MACRO.end();
    }
}
