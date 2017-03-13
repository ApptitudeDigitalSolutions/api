exports.getACs = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var company_id = req.params.company_id; 
    var isValid = 0;

    var mysql = require('mysql');
    
     var connectionAC_MACRO = mysql.createConnection({ host: req.app.locals.AC_MACRO_DB_HOST, user: req.app.locals.AC_MACRO_DB_USER, password: req.app.locals.AC_MACRO_DB_PASSWORD, database: req.app.locals.AC_MACRO_DB_NAME });
    connectionAC_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

  var authenticate = require("./auth.js");
    authenticate.authenticate(req,function(returnValue) {
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

            var query = 'SELECT id,company_id,created_on,participants_count,title, description, DATE_FORMAT(to_be_conducted_on,GET_FORMAT(DATE,\'EUR\')) as to_be_conducted_on , activity_ids, activity_types FROM Assessment_Center_templates WHERE company_id =\'' + company_id + '\';';
            connectionAC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

            var objToStringify = {acs:[]};

            for(i in rows){
                var sqlDate = rows[i].to_be_conducted_on;

                var ac = {
                    ac_id: rows[i].id,
                    title: rows[i].title,
                    conducted_on: rows[i].to_be_conducted_on,
                    participants_count: rows[i].participants_count,
                    description:rows[i].description,
                    activity_ids:rows[i].activity_ids,
                    activity_types:rows[i].activity_types
                      
                };

                var x = objToStringify.acs.length;
                objToStringify.acs[x] = ac;
            }

            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            var json = JSON.stringify(objToStringify);
            console.log('the Json block sent looks like : ' + json);
            res.end(json);
            
        }});
        connectionAC_MACRO.end();
    }
}
