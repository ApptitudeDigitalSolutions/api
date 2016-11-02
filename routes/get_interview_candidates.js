exports.getInterviewCandidates = function (req, res) {
    var usersname = req.body.username;
    var passcode = req.body.passcode;
    var interviewID = req.query.interview_id; 
    var isValid = 0;

    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var connectionTo_INTERVIEW_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'INTERVIEW_MACRO' });
    connectionTo_INTERVIEW_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var async = require('async');
    async.series([function(callback) {
            getInterviewCandidatesFunction(callback);
    }]);

    function getInterviewCandidatesFunction(callback) {
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
                            formatJsonForAllInterviewCandidates();
                    } else {
                    
                        if (result == '' || result == undefined) {

                             var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        formatJsonForAllInterviewCandidates();
                                        
                                    }
                                }});
                                connection.end();

                            
                    }
                  }
         });
    }


    function formatJsonForAllInterviewCandidates(callback){
    		// get count of sections
    		var query = 'SELECT * FROM Interview_candidates_'+interviewID+';';
            connectionTo_INTERVIEW_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
            
            var objToStringify = {candidates:[]};

            for(i in rows){

            		var candidate_id = rows[i].id;
            		var first = rows[i].First;
            		var last = rows[i].Last;
            		var email = rows[i].Email;
                    var role = rows[i].Role;
                    var other = rows[i].Other;

       

            		var candidateJSONObject = { candidate_id: id,
                                                candidate_first: first,
                                                candidate_last: last,
                                                candidate_email: email,
                                                candidate_role: role,
                                                other: other};

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
            connectionTo_INTERVIEW_MACRO.end();

        	}});
    }
}
