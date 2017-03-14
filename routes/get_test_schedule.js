exports.getTestSchedule = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var company_id = req.params.company_id; 

    var isValid = 0;

  
    var mysql = require('mysql');
        var connectionTEST_MACRO = mysql.createConnection({ host: req.app.locals.TEST_MACRO_DB_HOST, user: req.app.locals.TEST_MACRO_DB_USER, password: req.app.locals.TEST_MACRO_DB_PASSWORD, database: req.app.locals.TEST_MACRO_DB_NAME });
    connectionTEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});



     var authenticate = require("./auth.js");
    authenticate.authenticate(username,passcode,req,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([formatJsonForAllTests], function (err, result) { console.log("DONE");  connectionTEST_MACRO.end(); });
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

    function formatJsonForAllTests(callback){

            var query = 'SELECT id,test_title,DATE_FORMAT(to_be_conducted_on,GET_FORMAT(DATE,\'EUR\')) as to_be_conducted_on,description,section_delimiters,section_tags FROM Test_templates WHERE company_id =\'' + company_id + '\' AND should_be_returned <> 0;';
            
            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

            var objToStringify = {tests:[]};
            console.log(rows);
            for(i in rows){
                var test = {
                    test_id: rows[i].id,
                    test_title: rows[i].test_title,
                    to_be_conducted_on: rows[i].to_be_conducted_on,
                    description:rows[i].description,
                    section_delimiters:rows[i].section_delimiters,
                    section_tags:rows[i].section_tags
                };

                var x = objToStringify.tests.length;
                objToStringify.tests[x] = test;
            }

            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            var json = JSON.stringify(objToStringify);
            console.log('the Json block sent looks like : ' + json);
            res.end(json);
            
        }});
        connectionTEST_MACRO.end();
    }
}
