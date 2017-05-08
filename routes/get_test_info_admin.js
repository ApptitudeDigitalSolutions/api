exports.getTestInfo = function (req, res) {

    var username = req.body.username;
    var passcode = req.body.passcode;
    var testID = req.params.test_id; 
    
    var testInfo;
    var mysql = require('mysql');
    
        var connectionTEST_MACRO = mysql.createConnection({ host: req.app.locals.TEST_MACRO_DB_HOST, user: req.app.locals.TEST_MACRO_DB_USER, password: req.app.locals.TEST_MACRO_DB_PASSWORD, database: req.app.locals.TEST_MACRO_DB_NAME });
    connectionTEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


    var authenticate = require("./auth.js");
     authenticate.authenticate(username,passcode,req,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([getCurrentTestStatus], function (err, result) { console.log("DONE");  connectionTEST_MACRO.end(); });
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



     function getCurrentTestStatus(callback){
      //1. Get the current min test positon
      //2. Split the string of delimiters 
      //3. Itterate over the delimiters and get the index of the current position
      //4. return this value 

       var query = "SELECT min_page_of_test FROM Test_applicants_"+testID+";"
        console.log(query);
        connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

          if(rows.length() > 0){

               var CURRENT_MIN_PAGE = rows[0].min_page_of_test;
               console.log("Current min page = " + CURRENT_MIN_PAGE+ ". Now we need to get all section delimiters for the test so we can work out what the next section title will be.");

                var delimiters_array = [];
                var delimitersquery = 'SELECT section_delimiters FROM Test_templates WHERE id = '+testID+';';
                console.log(delimitersquery);

                connectionTEST_MACRO.query(delimitersquery, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

                    var delimitersString = rows[0].section_delimiters;
                    console.log("Delimiters string for test =  " + delimitersString);
                    delimiters_array = delimitersString.split(",");

                    console.log("OK so now we need to know the index of CURRENT_MIN_PAGE");

                    var index = delimiters_array.indexOf(CURRENT_MIN_PAGE);
                    console.log("Index of CURRENT_MIN_PAGE = " + index + ". Now we need to look up the title of the page in the test this corresponds too");

                    var updatequery = 'SELECT section_title FROM Test_intro_'+testID+' WHERE id = '+ delimiters_array[index+1] +';';
                    console.log(updatequery);

                    connectionTEST_MACRO.query(updatequery, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                        console.log("The NEXT title = "+ rows[0].section_title);
                        
                        res.writeHead(200, {
                          "Content-Type": "application/json"
                        });
                        var json = JSON.stringify({info:{next_section_title:rows[0].section_title}});
                        res.end(json);    

                    }});
                
                }});
          }else{

                var delimiters_array = [];
                var delimitersquery = 'SELECT section_delimiters FROM Test_templates WHERE id = '+testID+';';
                console.log(delimitersquery);

                connectionTEST_MACRO.query(delimitersquery, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

                    var delimitersString = rows[0].section_delimiters;
                    console.log("Delimiters string for test =  " + delimitersString);
                    delimiters_array = delimitersString.split(",");

                    var updatequery = 'SELECT section_title FROM Test_intro_'+testID+' WHERE id = '+ delimiters_array[0] +';';
                    console.log(updatequery);

                    connectionTEST_MACRO.query(updatequery, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                        console.log("The NEXT title = "+ rows[0].section_title);
                        
                        res.writeHead(200, {
                          "Content-Type": "application/json"
                        });
                        var json = JSON.stringify({info:{next_section_title:rows[0].section_title}});
                        res.end(json);    

                    }});
                
                }});   
          }

        }});
     }

}