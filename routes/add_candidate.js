exports.addCandidate = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var ac_id = req.params.ac_id; 

    var first = req.body.first;
    var last = req.body.last;
    var email = req.body.email;
    var role = req.body.role;
    var other = req.body.other;
    var activities_set = req.body.set_activities;
  
    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var connectionTo_INTERVIEW_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'AC_MACRO' });
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

    		var query = 'INSERT INTO Assessment_Center_candidates_'+ac_id+' (First,Last,Email,Role,Other,set_activities,completed_activities,created_on) VALUES (\''+first+'\',\''+last+'\',\''+email+'\',\''+role+'\',\''+other+'\',\''+activities_set+'\',\'\',NOW());';
            connectionTo_INTERVIEW_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
           
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            var json = JSON.stringify({success:1});
            console.log('Candidates >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + json);
            res.end(json);
            connectionTo_INTERVIEW_MACRO.end();

        	}});
    }
}
