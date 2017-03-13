exports.completion = function (req, res) {
    var candidate_id =req.body.candidate_id;
    var username = req.body.username;
    var passcode = req.body.passcode;
    var ac_id = req.params.ac_id; 
  
    var mysql = require('mysql');
     var connectionAC_MACRO = mysql.createConnection({ host: req.app.locals.AC_MACRO_DB_HOST, user: req.app.locals.AC_MACRO_DB_USER, password: req.app.locals.AC_MACRO_DB_PASSWORD, database: req.app.locals.AC_MACRO_DB_NAME });
    connectionAC_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


    var authenticate = require("./auth.js");
     authenticate.authenticate(username,passcode,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([addAnswer], function (err, result) { console.log("DONE");  connection.end(); });
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

    function addAnswer(callback){
    		// get count of sections
    		var query = 'UPDATE Assessment_Center_candidates_'+ac_id+' SET completed_activities = concat(\'p,\',completed_activities) WHERE id = \''+candidate_id+'\';';
            console.log(query);
            connectionTo_TEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

                 
                  res.writeHead(200, {
                      "Content-Type": "application/json"
                  });
                  var json = JSON.stringify({success:1});
                  console.log('TEST STATE IS ........................... ' + json);
                  res.end(json);
                  connectionTo_TEST_MACRO.end();
        	}});
    }
}
