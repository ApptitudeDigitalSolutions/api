exports.getTestParticipants = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var testID = req.params.test_id; 
    console.log("The test ID is " + testID);

    var mysql = require('mysql');
        var connectionTEST_MACRO = mysql.createConnection({ host: req.app.locals.TEST_MACRO_DB_HOST, user: req.app.locals.TEST_MACRO_DB_USER, password: req.app.locals.TEST_MACRO_DB_PASSWORD, database: req.app.locals.TEST_MACRO_DB_NAME });
    connectionTEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

     var authenticate = require("./auth.js");
    authenticate.authenticate(username,passcode,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([formatJsonForAllTestParticipants], function (err, result) { console.log("DONE");  connectionTEST_MACRO.end(); });
      }else{
          connectionTEST_MACRO.end(); 
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

    function formatJsonForAllTestParticipants(callback){
            // get count of sections
            var query = 'SELECT * FROM Test_admin_'+testID+';';
            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
            
            var objToStringify = {candidates:[]};

            for(i in rows){

                    var candidate_id = rows[i].candidate_id;
                    var first = rows[i].candidate_first;
                    var last = rows[i].candidate_last;
                    var email = rows[i].candidate_email;
                    var current_question = rows[i].currently_on_question;
                    var current_section = rows[i].currently_on_section;

       

                    var candidateJSONObject = { candidate_id: candidate_id,
                                                candidate_first: first,
                                                candidate_last: last,
                                                candidate_email: email,
                                                current_question: current_question,
                                                current_section: current_section};

                    console.log("Candidate > " + JSON.stringify(candidateJSONObject));
                    objToStringify.candidates.push(candidateJSONObject);
                        
            }

            // were all done creating the payload , itls time send 
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            var json = JSON.stringify(objToStringify);
            console.log('Candidates >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + json);
            res.end(json);
            connectionTEST_MACRO.end();

            }});
    }
}
