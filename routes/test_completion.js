exports.testCompletion = function (req, res) {
    
    var testID = req.query.test_id;
     var section_id = req.query.section_id;
     var candidate_id = req.query.candidate_id;
  
    var mysql = require('mysql');
        var connectionTEST_MACRO = mysql.createConnection({ host: req.app.locals.TEST_MACRO_DB_HOST, user: req.app.locals.TEST_MACRO_DB_USER, password: req.app.locals.TEST_MACRO_DB_PASSWORD, database: req.app.locals.TEST_MACRO_DB_NAME });
    connectionTEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

 
     var authenticate = require("./auth.js");
     authenticate.authenticate(req,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([testCompletionFunction], function (err, result) { console.log("DONE");  connectionTEST_MACRO.end(); });
      }else{
          connectionTEST_MACRO.end(); 
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

    function testCompletionFunction(callback){
    		// get count of sections
    		var query = 'UPDATE Test_Admin_' + testID + ' SET currently_on_section = 1000 WHERE candidate_id = '+candidate_id+';';
            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
           
            res.end(200);
            connectionTEST_MACRO.end();
        	}});
    }
}
