exports.getAssessmentCentresCandidates = function (req, res) {
    var ac_id = req.body.ac_id; 
    var username = req.body.username;
    var passcode = req.body.passcode;
    console.log("AC_ID -s "+ac_id);
    var isValid = 0;

    var mysql = require('mysql');
     var connectionAC_MACRO = mysql.createConnection({ host: req.app.locals.AC_MACRO_DB_HOST, user: req.app.locals.AC_MACRO_DB_USER, password: req.app.locals.AC_MACRO_DB_PASSWORD, database: req.app.locals.AC_MACRO_DB_NAME });
    connectionAC_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

   var authenticate = require("./auth.js");
    authenticate.authenticate(username,passcode,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([formatJsonForAllACCandidates], function (err, result) { console.log("DONE");  connectionAC_MACRO.end(); });
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


    function formatJsonForAllACCandidates(callback){
    		// get count of sections
    		var query = 'SELECT * FROM Assessment_Center_candidates_'+ac_id+';';
            connectionAC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
            
            var objToStringify = {candidates:[]};

            for(i in rows){

            		var candidate_id = rows[i].id;
            		var first = rows[i].First;
            		var last = rows[i].Last;
            		var email = rows[i].Email;
                    var role = rows[i].Role;
                    var other = rows[i].Other;
                    var set_activities = rows[i].set_activities;
                    var completed_activities = rows[i].completed_activities;
                    var completed_activitie_lables = rows[i].completed_activitie_lables;

            		var candidateJSONObject = { candidate_id: candidate_id,
                                                candidate_first: first,
                                                candidate_last: last,
                                                candidate_email: email,
                                                candidate_role: role,
                                                other: other,
                                                set_activities:set_activities,
                                                completed_activities:completed_activities,
                                                completed_activitie_lables:completed_activitie_lables
                                            };

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
            connectionAC_MACRO.end();

        	}});
    }
}
