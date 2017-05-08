exports.reset_test = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var testID = req.params.test_id; 
    var pageNumber = req.body.page_number;
  
    var mysql = require('mysql');
    
        var connectionTEST_MACRO = mysql.createConnection({ host: req.app.locals.TEST_MACRO_DB_HOST, user: req.app.locals.TEST_MACRO_DB_USER, password: req.app.locals.TEST_MACRO_DB_PASSWORD, database: req.app.locals.TEST_MACRO_DB_NAME });
    connectionTEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


var authenticate = require("./auth.js");
     authenticate.authenticate(username,passcode,req,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([nextSectionFunction, getAllCandidateTokens], function (err, result) { console.log("DONE");  connectionTEST_MACRO.end(); });
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


    function nextSectionFunction(callback){
            // get count of sections
            var query = 'UPDATE Test_applicants_'+testID+' SET min_page_of_test = 0;';
            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
           
            callback(null);
            }});
    }

    function getAllCandidateTokens(callback){
          // get count of sections
          var gcm = require('node-gcm');
            var query = 'SELECT token FROM Test_applicants_'+testID+';';
            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
              var tokens = [];
            for(i in rows){

              // send push notification saying test has sended

              var token = rows[i].token;
              
              console.log("HERES THE token = " + token);
              
              if(token != "null" || token != "" || token != null){
              //'. Let them know if you can make it by heading to Notifications in Timbo.'
                    tokens.push(token);  
              }

            }

            var message = new gcm.Message({
                                priority: 'high',
                                  contentAvailable: true, 
                                    notification: {
                                        title: 'Test Reset',
                                        body: "done"
                                      }
                                  });
                      
                    
            var sender = new gcm.Sender("AAAAs80Jbjo:APA91bGDCUTfyPuuDgxrEEjei7t-0jLLf_FrxFfwQz4nm-CHOnQ4o1hsjwUQOURjzzpshSvb8VKFSZpHxsmpR_O2mHx0whxiQhATC5KSG01sQc3-3CVvl3v6dEQHE9I8_95vYLJAgd2a");
            sender.send(message, tokens, function (err, response) {
                if (err) {console.error("Error:", err);}else console.log("Response:", response);
            });
           
            res.writeHead(200, {
                  "Content-Type": "application/json"
              });
             var json = JSON.stringify({success:1});
             console.log('TEST STATE IS ........................... ' + json);
            res.end(json);
            connectionTEST_MACRO.end();
            }});
    }

}
