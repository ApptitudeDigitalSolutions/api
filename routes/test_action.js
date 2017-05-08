exports.performTestAction = function (req, res) {

    var username = req.body.username;
    var passcode = req.body.passcode;
    var action = req.params.action; 
    var testID = req.query.test_id; 

    var ADMINS_EMAIL_ADDRESS= "";
    
    var testInfo;
    var mysql = require('mysql');
    
    var connectionTEST_MACRO = mysql.createConnection({ host: req.app.locals.TEST_MACRO_DB_HOST, user: req.app.locals.TEST_MACRO_DB_USER, password: req.app.locals.TEST_MACRO_DB_PASSWORD, database: req.app.locals.TEST_MACRO_DB_NAME });
    connectionTEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


    var authenticate = require("./auth.js");
     authenticate.authenticate(username,passcode,req,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([getAdminsEmailAddress, actionFlow], function (err, result) { console.log("DONE"); });
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

    function getAdminsEmailAddress(callback){
      // get count of sections
      var mysql = require('mysql');
              var connection = mysql.createConnection({
                  host: req.app.locals.MACRO_DB_HOST,
                  user: req.app.locals.MACRO_DB_USER,
                  password: req.app.locals.MACRO_DB_PASSWORD,
                  database: req.app.locals.MACRO_DB_NAME
              });

              connection.connect(function(err) {
                  if (err) {
                      console.error('error connecting: ' + err.stack);
                       callback(false);
                      return false;
                  }
              });


              var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
              console.log(query);

              connection.query(query, function(err, rows) {
                  if (err) {
                     console.log(err);
                      callback(false);
                      return false;
                  } else { 
                      ADMINS_EMAIL_ADDRESS = rows[0].email;
                      callback(null);
                  }});
    }
  

     function actionFlow(callback){

        if(action == "start"){
            startTest();
        }

        if(action == "next"){
            nextSection();
        }

        if(action == "reset"){
            resetTest();
        }

        if(action == "complete"){
            completeTest();
        }

     }


     function startTest(){

        //1. Get the section delimieter
        //2. Split the stirng to array 
        //3. Set test positon = array[0]

        console.log("We are STARTING a test : " + testID);
        var delimiters_array = [];
        var delimitersquery = 'SELECT section_delimiters FROM Test_templates WHERE id = '+testID+';';
        console.log(delimitersquery);

        connectionTEST_MACRO.query(delimitersquery, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

            var delimitersString = rows[0].section_delimiters;
            console.log("Delimiters string for test =  " + delimitersString);
            delimiters_array = delimitersString.split(",");

            console.log("The page number for the first delimiter = " + delimiters_array[0] + " now updating the test candidates accordingly");

            var updatequery = 'UPDATE Test_applicants_'+testID+' SET min_page_of_test = '+ delimiters_array[0] +';';
            console.log(updatequery);

            connectionTEST_MACRO.query(updatequery, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                
                console.log("UPDATE successful");
                res.writeHead(200, {
                  "Content-Type": "application/json"
                });
                var json = JSON.stringify({success:1});
                res.end(json);    
            }});
        }});


     }

     function nextSection(){

        // get the current test position
        // get the section delimieter
        // check the index of the current postion
          // if the current position == last in array then we need to call the completeTest function
        // update the min_page_of_test setting it equal to it plus 1 (in index terms) 

        console.log("We are now going to the NEXT SECTION for test : " + testID);

        console.log("Looking for current page number ....... ");

        var query = "SELECT min_page_of_test FROM Test_applicants_"+testID+";"
        console.log(query);
        connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
           var CURRENT_MIN_PAGE = rows[0].min_page_of_test;
           console.log("Current min page = " + CURRENT_MIN_PAGE+ ". Now we need to get all section delimiters for the test : " + testID);

            var delimiters_array = [];
            var delimitersquery = 'SELECT section_delimiters FROM Test_templates WHERE id = '+testID+';';
            console.log(delimitersquery);

            connectionTEST_MACRO.query(delimitersquery, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

                var delimitersString = rows[0].section_delimiters;
                console.log("Delimiters string for test =  " + delimitersString);
                delimiters_array = delimitersString.split(",");

                console.log("OK so now we need to know the index of CURRENT_MIN_PAGE");

                var index = delimiters_array.indexOf(CURRENT_MIN_PAGE);
                console.log("Index of CURRENT_MIN_PAGE = " + index + ". We need to increase the index by one and then update min_page_of_test accordingly");

                var updatequery = 'UPDATE Test_applicants_'+testID+' SET min_page_of_test = '+ delimiters_array[index+1] +';';
                console.log(updatequery);

                connectionTEST_MACRO.query(updatequery, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                    
                    console.log("UPDATE successful");
                    res.writeHead(200, {
                      "Content-Type": "application/json"
                    });
                    var json = JSON.stringify({success:1});
                    res.end(json);    
                }});
            
            }});


        }});

     }




    function resetTest(){

      console.log("We are RESETTING the test : " + testID);
      // DO SOME DB UPDATES
       var query = 'UPDATE Test_applicants_'+testID+' SET min_page_of_test = 0;';
            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
           
                var query = 'UPDATE Test_admin_'+testID+' SET currently_on_question = 0 , currently_on_section = 0;';
                connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                  
                    // SEND NOTIFIECATIONS TO TABLETS TO REST
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

                
                }});

            }});

    }



    function completeTest(){

        console.log("We are COMPLETING test : " + testID);
    
        var query = 'UPDATE Test_admin_' + testID + ' SET currently_on_section = 1000;';
         console.log(query);
           connectionTEST_MACRO .query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else { 
            prepareReport();  
          }});
    }


    

    function prepareReport(callback){

      var postmark = require("postmark");
      var client = new postmark.Client("7424f227-688f-4979-93ac-e7b35d2de10d");

      var query = "SELECT * FROM `Test_results_"+testID+"` WHERE candidate_id IN (SELECT candidate_id FROM `Test_applicants_"+testID+"`) ORDER BY candidate_id DESC, section_id , question_id ASC;";
       console.log(query);
      connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {  


        var json2csv = require('json2csv');
        var fs = require('fs');
        var fields = ['Candidate id', 'Candidate email address', 'Question', 'Section', 'Candidate answer', 'Correct', 'Time taken on question'];

        var candidatesRows = [];

        var rowCounter = 2;
        var currentCanID = 0;

        var questionCounter = 0;
        var correctAnswersCounter = 0;
        var averageTimeTakenCounter = 0;

// do parsing in here 
        for(i in rows){
                 
                  if(rows[i].candidate_id != currentCanID && currentCanID !=0){
                    // calculate the averages
                    averageTimeTakenCounter = averageTimeTakenCounter/questionCounter;
                    percentageCorrectAnswers = correctAnswersCounter/questionCounter;

                      candidatesRows.push({"Candidate id":""});
                      candidatesRows.push({"Candidate id":"Total correct answers for candidate = " + correctAnswersCounter});
                      
                      candidatesRows.push({"Candidate id":"Percentage of correct answers for candidate = " + percentageCorrectAnswers});
                      
                      candidatesRows.push({"Candidate id":"Average Time spent per question = " + percentageCorrectAnswers + " seconds"});
                      
                      candidatesRows.push({"Candidate id":""});
                      candidatesRows.push({"Candidate id":""});
                      candidatesRows.push({"Candidate id":""});

                    questionCounter = 0;
                    correctAnswersCounter = 0;
                    averageTimeTakenCounter = 0;

                    currentCanID = rows[i].candidate_id;
                  }

                  if(currentCanID == 0){
                    currentCanID = rows[i].candidate_id;
                  }

                  // add each row to the file
                  candidatesRows.push({"Candidate id":rows[i].candidate_id,"Candidate email address":rows[i].candidate_email,"Question":rows[i].question_id,"Section":rows[i].section_id,"Candidate answer":rows[i].answer,"Correct":rows[i].was_correct,"Time taken on question":rows[i].time_taken_on_question});
                  if(rows[i].was_correct == 1){
                    correctAnswersCounter++;
                  }
                  averageTimeTakenCounter = averageTimeTakenCounter + rows[i].time_taken_on_question;
                  questionCounter++;

                  rowCounter++;
                 
        } 

        var csv = json2csv({ data: candidatesRows, fields: fields });
                
        savePath = '/home/ubuntu/api/reports/results_'+testID+'.csv';

        fs.writeFile(savePath, csv, function(err) {
          if (err) throw err;
          console.log('file saved');

         // console.log(csv.toString());
           var c = csv.toString();
          // var fc = c.toString('base64');
          var fc = new Buffer(c).toString('base64');
          console.log(fc);

          client.sendEmail({
                "From": "elliotcampbelton@apptitudedigitalsolutions.com", 
                "To": ADMINS_EMAIL_ADDRESS, 
                "Subject": "Test results for candidates : Test ID " + testID, 
                "TextBody": "Hey ," + username + " attatched are the results for the candidates of test "+ testID + "." ,
                "Attachments": [{
                  // Reading synchronously here to condense code snippet: 
                  "Content": fc,
                  "Name": 'results_'+testID+'.csv',
                  "ContentType": "application/CSV"
                }]
            }, function(error, result) {
                if(error) {
                    console.error("Unable to send via postmark: " + error.message);
                    return;
                }
                console.info("Sent to postmark for delivery")
            });
        });

        
      }});

    }



}