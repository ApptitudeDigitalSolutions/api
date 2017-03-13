exports.getstatus = function (req, res) {

    var testID = req.params.test_id; 
    var candidatesEmail = req.body.candidate_email;

    var min_page_of_test = {min_page_of_test:''};

    console.log(req.body);
    
    var mysql = require('mysql');
    
    var connectionTEST_MACRO = mysql.createConnection({ host: req.app.locals.TEST_MACRO_DB_HOST, user: req.app.locals.TEST_MACRO_DB_USER, password: req.app.locals.TEST_MACRO_DB_PASSWORD, database: req.app.locals.TEST_MACRO_DB_NAME });
    connectionTEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

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
            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
        
                if (rows.length > 0){
                    min_page_of_test = {min_page_of_test:rows[0].min_page_of_test}; 
                    respondToRequest();
                    
                }else{
                    res.end(401);
                }
            }});
            connectionTEST_MACRO.end();
                   
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
