exports.getstatus = function (req, res) {

    var testID = req.query.test_id; 
    var candidatesEmail = req.body.candidate_email;

    var min_page_of_test = {min_page_of_test:''};

    console.log(req.body);
    
    var mysql = require('mysql');
    
    var connectionTo_TEST_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'TEST_MACRO' });
    connectionTo_TEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var async = require('async');
    async.series([function(callback) {
        
        howToAuth();

    }]);

    function howToAuth(callback){
      
        if(candidatesEmail != ''){
            // this is a test participant and hence we need to send them down the other way 
            console.log("Auth as a test participant");
            authenticateAsParticipant(callback);
        }else{
            console.log("roger");
        }

    }

  
    function authenticateAsParticipant(callback) {
         var query = 'SELECT * FROM Test_applicants_'+testID+' WHERE email =\'' + candidatesEmail + '\';';
            connectionTo_TEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
        
                var storedPasscode = rows[0].passcode;
                if (rows.length > 0){
                    min_page_of_test = {min_page_of_test:rows[0].min_page_of_test}; 
                    respondToRequest();
                    
                }else{
                    res.end(401);
                }
            }});
            connectionTo_TEST_MACRO.end();
                   
    }


    function respondToRequest(callback){
    		// get count of sections
    		res.writeHead(200, {
                "Content-Type": "application/json"
            });
            var json = JSON.stringify(min_page_of_test);
            console.log('TEST STATE IS ........................... ' + json);
            res.end(json);
           
    }
}
