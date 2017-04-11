exports.setPage = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var testID = req.params.test_id; 
    var pageNumber = req.body.page_number;
    var testEndFlag = req.body.testEndFlag;
  
    var mysql = require('mysql');
        var connectionTEST_MACRO = mysql.createConnection({ host: req.app.locals.TEST_MACRO_DB_HOST, user: req.app.locals.TEST_MACRO_DB_USER, password: req.app.locals.TEST_MACRO_DB_PASSWORD, database: req.app.locals.TEST_MACRO_DB_NAME });
    connectionTEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

var authenticate = require("./auth.js");
     authenticate.authenticate(username,passcode,req,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([nextSectionFunction], function (err, result) { console.log("DONE");  connectionTEST_MACRO.end(); });
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
    		var query = 'UPDATE Test_applicants_'+testID+' SET min_page_of_test = '+pageNumber+';';
            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
           console.log(testEndFlag);
           if(testEndFlag == "true"){
              testCompletionFunction();
              prepareReport();
           }
            res.writeHead(200, {
                  "Content-Type": "application/json"
              });
              var json = JSON.stringify({success:1});
              console.log('TEST STATE IS ........................... ' + json);
            res.end(json);
            //connectionTEST_MACRO.end();
        	}});
    }

   function testCompletionFunction(){
        // get count of sections
        var query = 'UPDATE Test_admin_' + testID + ' SET currently_on_section = 1000;';
            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {   
          }});
    }


    function prepareReport(callback){
      var officegen = require('officegen');
      var xlsx = officegen ( 'xlsx' );
      sheet = xlsx.makeNewSheet ();
      sheet.name = 'Results for test ALL';


      var query = "SELECT * FROM `Test_results_"+testID+"` WHERE candidate_id IN (SELECT candidate_id FROM `Test_applicants_"+testID+"`) ORDER BY candidate_id DESC, section_id , question_id ASC;";
      connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {  

        var rowCounter = 2;
        var currentCanID = 0;

        var questionCounter = 0;
        var correctAnswersCounter = 0;
        var averageTimeTakenCounter = 0;

          sheet.data[0][0] = "All results for test " + testID;

          sheet.data[1][0] = "Candidate id";
          sheet.data[1][1] = "Candidate email address";
          sheet.data[1][2] = "Question";
          sheet.data[1][3] = "Section";
          sheet.data[1][4] = "Candidate answer";
          sheet.data[1][5] = "Correct?";
          sheet.data[1][6] = "Time taken on question";

        for(i in rows){
         
          if(rows[i].candidate_id != currentCanID){
            // calculate the averages
            averageTimeTakenCounter = averageTimeTakenCounter/questionCounter;
            percentageCorrectAnswers = correctAnswersCounter/questionCounter;
              rowCounter++;
              sheet.data[rowCounter][0] = "Total correct answers for candidate = " + correctAnswersCounter;
              rowCounter++;
              sheet.data[rowCounter][0] = "Percentage of correct answers for candidate = " + percentageCorrectAnswers;
              rowCounter++;
              sheet.data[rowCounter][0] = "Average Time spent per question = " + percentageCorrectAnswers + " seconds";
  
            // add new row
            rowCounter++;
            sheet.data[rowCounter] = [];
            rowCounter++;
            sheet.data[rowCounter] = [];

            questionCounter = 0;
            correctAnswersCounter = 0;
            averageTimeTakenCounter = 0;
            
            rowCounter++;
          }

          // add each row to the file
          sheet.data[rowCounter][0] = rows[i].candidate_id;
          sheet.data[rowCounter][1] = rows[i].candidate_email;
          sheet.data[rowCounter][2] = rows[i].question_id;
          sheet.data[rowCounter][3] = rows[i].section_id;
          sheet.data[rowCounter][4] = rows[i].answer;
          sheet.data[rowCounter][5] = rows[i].was_correct;
          sheet.data[rowCounter][6] = rows[i].time_taken_on_question;

          if(rows[i].was_correct == 1){
            correctAnswersCounter++;
          }
          averageTimeTakenCounter = averageTimeTakenCounter + rows[i].time_taken_on_question;
          questionCounter++;

          rowCounter++;
        } 

        var out = fs.createWriteStream ( '/home/ubuntu/api/reports/results_'+testID+'.xlsx' );
        var savePath = '/home/ubuntu/api/reports/results_'+testID+'.xlsx';
        out.on ( 'error', function ( err ) {
          console.log ( err );
        });

        xlsx.generate ( out );

        var postmark = require("postmark");
        var client = new postmark.Client("7424f227-688f-4979-93ac-e7b35d2de10d");
        var fs = require('fs');
         
        client.sendEmail({
            "From": "elliotcampbelton@apptitudedigitalsolutions.com", 
            "To": "e.b.campbelton@gmail.com", 
            "Subject": "Test", 
            "TextBody": "Test Message",
            "Attachments": [{
              // Reading synchronously here to condense code snippet: 
              "Content": fs.readFileSync(savePath).toString('base64'),
              "Name": 'results_'+testID+'.xlsx',
              "ContentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }]
        }, function(error, result) {
            if(error) {
                console.error("Unable to send via postmark: " + error.message);
                return;
            }
            console.info("Sent to postmark for delivery")
        });


      }});

    }
}
