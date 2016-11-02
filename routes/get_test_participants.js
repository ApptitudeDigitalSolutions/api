exports.getTestParticipants = function (req, res) {
    var usersname = req.body.username;
    var passcode = req.body.passcode;
    var testID = req.query.test_id; 


    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var connectionTo_TEST_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'TEST_MACRO' });
    connectionTo_TEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});
   
    var async = require('async');
    async.series([function(callback) {
            getTestParticipantsFunction(callback);
    }]);

    function getTestParticipantsFunction(callback) {
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

                                        formatJsonForAllTestParticipants();
                                        
                                    }
                                }});
                                connection.end();

                            
                    }
                  }
         });
    }


    function formatJsonForAllTestParticipants(callback){
            // get count of sections
            var query = 'SELECT * FROM Test_applicants_'+testID+';';
            connectionTo_TEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
            
            var objToStringify = {candidates:[]};

            for(i in rows){

                    var candidate_id = rows[i].id;
                    var first = rows[i].candidate_first;
                    var last = rows[i].candidate_last;
                    var email = rows[i].candidate_email;
                    var current_question = rows[i].currently_on_question;
                    var current_section = rows[i].currently_on_section;

       

                    var candidateJSONObject = { candidate_id: id,
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
            connectionTo_TEST_MACRO.end();

            }});
    }
}
