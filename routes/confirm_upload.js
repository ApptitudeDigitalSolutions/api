exports.confirmUpload = function (req, res) {
    var usersname = req.body.username;
    var passcode = req.body.passcode;
    var aw = req.query.wavFileName; 
    var qid = req.body.question_id;
    var sid = req.body.section_id;
    var at = req.body.answer_text;
    var an = req.body.answer_notes;
    var interviewID = req.body.interview_id;
    var candidateID = req.query.candidate_id; 
    
    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var connectionTo_INTERVIEW_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'INTERVIEW_MACRO' });
    connectionTo_INTERVIEW_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var async = require('async');
    async.series([function(callback) {
            confirmUploadFunction(callback);
    }]);

    function confirmUploadFunction(callback) {
        memcached.get(username, function(err, result) {

        if (err) {
            console.error(err)
        };
        console.dir(result);
        if (result == passcode) {
              connection.end();
              confrim();

        } else {
        
            if (result == '' || result == undefined) {

                 var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                    connection.query(query, function(err, rows) {if (err) { console.log('Error : The SQL statement is realy batty' + err); return;} else {
                
                        storedPasscode = rows[0].passcode;
                        if (passcode == storedPasscode){

                            confrim();
                            
                        }
                    }});
                    connection.end();
               
        }
      }
     });
    }


 function confrim(callback){
        var query = 'INSERT INTO Interview_results_'+interviewID+' (candidate_id,question_id,section_id,answer_text,answer_wav,answer_notes) VALUES ('+candidateID+','+qid+','+sid+','+at+','+aw+','+an+');';
        connectionTo_INTERVIEW_MACRO.query(query, function(err, rows) {if (err) { console.log('Err SQL' + err); return;} else {

           res.end(200);
        }});
        connectionTo_INTERVIEW_MACRO.end();
}
  	
}