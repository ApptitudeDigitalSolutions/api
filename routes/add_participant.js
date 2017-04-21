exports.addParticipant = function (req, res) {
    // var username = req.body.username;
    // var passcode = req.body.passcode;
    var testID = req.params.test_id; 


    var first = req.body.first;
    var last = req.body.last;
    var email = req.body.email;
    var DoB = req.body.dob;
    var Token = req.body.token;
    var other = "";

    console.log(req.body);
  
    var mysql = require('mysql');
    
    var connectionTEST_MACRO = mysql.createConnection({ host: req.app.locals.TEST_MACRO_DB_HOST, user: req.app.locals.TEST_MACRO_DB_USER, password: req.app.locals.TEST_MACRO_DB_PASSWORD, database: req.app.locals.TEST_MACRO_DB_NAME });
    connectionTEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


    var async = require('async');
    async.series([function(callback) {
            authenticate(callback);
    }]);

    function authenticate(callback) {
           addNewParticipant(); 
    }


    function addNewParticipant(callback){
    		// get count of sections
    		var query = 'INSERT INTO Test_applicants_'+testID+' (First,Last,Email,DoB,min_page_of_test,test_stage_state,other,token) VALUES (\''+first+'\',\''+last+'\',\''+email+'\',\''+DoB+'\',0,\'none\',\''+other+'\',\''+Token+'\');';
        console.log(query);
            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

                 var query2 = 'INSERT INTO Test_admin_'+testID+' (`candidate_first`, `candidate_last`, `candidate_email`, `currently_on_question`, `currently_on_section`) VALUES (\''+first+'\',\''+last+'\',\''+email+'\',0,0);';
                  console.log(query2);
                  connectionTEST_MACRO.query(query2, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                 
                 
                  res.writeHead(200, {
                      "Content-Type": "application/json"
                  });
                  var json = JSON.stringify({success:1});
                  console.log('TEST STATE IS ........................... ' + json);
                  res.end(json);
                  connectionTEST_MACRO.end();
                }});
       
        	}});
    }
}
