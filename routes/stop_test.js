exports.stopTest = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var testID = req.query.test_id; 
  
    var mysql = require('mysql');
    var connectionTEST_MACRO = mysql.createConnection({ host: req.app.locals.TEST_MACRO_DB_HOST, user: req.app.locals.TEST_MACRO_DB_USER, password: req.app.locals.TEST_MACRO_DB_PASSWORD, database: req.app.locals.TEST_MACRO_DB_NAME });
    connectionTEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    
    var authenticate = require("./auth.js");
     authenticate.authenticate(username,passcode,req,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([stopTestFunction], function (err, result) { console.log("DONE");  connection.end(); });
      }else{
          connection.end(); 
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

    
    function stopTestFunction(callback){
    		// get count of sections
    		var query = 'UPDATE Test_applicants_'+testID+' SET test_stage_state = \'stop_test\';';
            connectionTo_TEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
           
            res.end(200);
            connectionTo_TEST_MACRO.end();
        	}});
    }
}
