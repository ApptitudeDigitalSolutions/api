exports.addCandidate = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var interviewID = req.query.interview_id; 

    var first = req.body.first;
    var last = req.body.last;
    var email = req.body.email;
    var role = req.body.role;
    var other = req.body.other;
  
    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var connectionTo_INTERVIEW_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'INTERVIEW_MACRO' });
    connectionTo_INTERVIEW_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


    var async = require('async');
    async.series([function(callback) {
            addCandidateFunction(callback);
    }]);

    function addCandidateFunction(callback) {

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
                            addNewCandidate();
                    } else {
                    
                        if (result == '' || result == undefined) {

                             var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        addNewCandidate();
                                        
                                    }
                                }});
                                connection.end(); 
                    }
                  }
         });
    }


    function addNewCandidate(callback){
    		// get count of sections
    		var query = 'INSERT INTO Interview_Candidates_'+interviewID+' (Frist,Last,Email,Role,Other,created_on) VALUES (\''+first+'\',\''+last+'\',\''+email+'\',\''+role+'\',\''+other+'\',NOW());';
            connectionTo_INTERVIEW_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
           
            res.end(200);
            connectionTo_INTERVIEW_MACRO.end();

        	}});
    }
}
