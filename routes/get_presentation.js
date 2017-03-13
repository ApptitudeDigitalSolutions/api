exports.getPresentationDetails = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var ac_id = req.params.ac_id; 
    var isValid = 0;

    var mysql = require('mysql');
    
     var connectionAC_MACRO = mysql.createConnection({ host: req.app.locals.AC_MACRO_DB_HOST, user: req.app.locals.AC_MACRO_DB_USER, password: req.app.locals.AC_MACRO_DB_PASSWORD, database: req.app.locals.AC_MACRO_DB_NAME });
    connectionAC_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});
 
     var authenticate = require("./auth.js");
    authenticate.authenticate(username,passcode,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([formatJsonForAllInterviews], function (err, result) { console.log("DONE");  connectionAC_MACRO.end(); });
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

    function formatJsonForAllInterviews(callback){
    		// get count of sections
    		var query = 'SELECT * FROM Presentation_'+ac_id+';';
            connectionAC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
            
            var objToStringify = {pages:[]};

            for(i in rows){
            		var page = {    id:rows[i].id,
                                    presentation_info_ref:rows[i].presentation_info_ref,
                                    presentation_info_text:rows[i].presentation_info_text
                                };
                                
                    objToStringify.pages.push(page);
            }

            console.log(objToStringify);

          	// were all done creating the payload , itls time send 
          	res.writeHead(200, {
                "Content-Type": "application/json"
            });
            var json = JSON.stringify(objToStringify);
            console.log('RES QUESTIONS + PROMPTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + json);
            res.end(json);
            connectionAC_MACRO.end();

        	}});

    }
}
