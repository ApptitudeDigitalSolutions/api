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
    
    var connectionAC_MACRO = mysql.createConnection({ host: req.app.locals.AC_MACRO_DB_HOST, user: req.app.locals.AC_MACRO_DB_USER, password: req.app.locals.AC_MACRO_DB_PASSWORD, database: req.app.locals.AC_MACRO_DB_NAME });
    connectionAC_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var authenticate = require("./auth.js");
    authenticate.authenticate(username,passcode,req,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([addNewCandidate], function (err, result) { console.log("DONE");  connectionAC_MACRO.end(); });
      }else{
          connectionAC_MACRO.end(); 
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

    
    function addNewCandidate(callback){
    		// get count of sections

    		var query = 'INSERT INTO Assessment_Center_candidates_'+ac_id+' (First,Last,Email,Role,Other,set_activities,completed_activities,created_on) VALUES (\''+first+'\',\''+last+'\',\''+email+'\',\''+role+'\',\''+other+'\',\''+activities_set+'\',\'\',NOW());';
            connectionAC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
           
            res.writeHead(200, {
                
                "Content-Type": "application/json"
            });
            var json = JSON.stringify({success:1});
            console.log('Candidates >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + json);
            res.end(json);
            connectionAC_MACRO.end();

        	}});
    }
}
