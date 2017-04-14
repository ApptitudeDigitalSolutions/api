exports.setPage = function (req, res) {

  // test with curl -H "Content-Type: application/json" -X POST -d '{"username":"elliot_admin","passcode":"2geEb","testID":"4","pageNumber":"40","testEndFlag":"true"}' https://adsapp.eu/v1/companies/test/set/4

    var username = req.body.username;
    var passcode = req.body.passcode;
    var testID = req.params.test_id; 
    var pageNumber = req.body.page_number;
    var testEndFlag = req.body.testEndFlag;

    var savePath = "";
    
    var async = require ( 'async' );
    var officegen = require('officegen');
    var fs = require('fs');
    var path = require('path');
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
        console.log(query);
    		var query = 'UPDATE Test_applicants_'+testID+' SET min_page_of_test = '+pageNumber+';';
         console.log(query);

            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
           console.log(testEndFlag);
           if(testEndFlag == "true"){

             console.log("Flag Is TRUE");
              testCompletionFunction();
              prepareReport2();
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
         console.log(query);
            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {   
          }});
    }


    function prepareReport(callback){



      var officegen = require('officegen');
      var xlsx = officegen ( 'xlsx' );

      xlsx.on ( 'finalize', function ( written ) {
      console.log ( 'Finish to create an Excel file.' + written );

        var postmark = require("postmark");
        var client = new postmark.Client("7424f227-688f-4979-93ac-e7b35d2de10d");

      fs.readFile(savePath, function read(err, data) {
      if (err) throw err;
      console.log(data);
      var fc = data.toString('base64');

      client.sendEmail({
            "From": "elliotcampbelton@apptitudedigitalsolutions.com", 
            "To": "e.b.campbelton@gmail.com", 
            "Subject": "Test", 
            "TextBody": "Test Message",
            "Attachments": [{
              // Reading synchronously here to condense code snippet: 
              "Content": fc,
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
        

    });
      
      });
      

      sheet = xlsx.makeNewSheet ();
      sheet.name = 'Results for test ALL';


      var query = "SELECT * FROM `Test_results_"+testID+"` WHERE candidate_id IN (SELECT candidate_id FROM `Test_applicants_"+testID+"`) ORDER BY candidate_id DESC, section_id , question_id ASC;";
       console.log(query);
      connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {  

        var rowCounter = 2;
        var currentCanID = 0;

        var questionCounter = 0;
        var correctAnswersCounter = 0;
        var averageTimeTakenCounter = 0;

          sheet.data[0] = [];
          sheet.data[0][0] = "All results for test " + testID;

          sheet.data[1] = [];
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
              sheet.data[rowCounter] = [];
              sheet.data[rowCounter][0] = "Total correct answers for candidate = " + correctAnswersCounter;
              rowCounter++;
              sheet.data[rowCounter] = [];
              sheet.data[rowCounter][0] = "Percentage of correct answers for candidate = " + percentageCorrectAnswers;
              rowCounter++;
              sheet.data[rowCounter] = [];
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
            sheet.data[rowCounter] = [];
          }

          // add each row to the file
          sheet.data[rowCounter] = [];
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
          sheet.data[rowCounter] = [];
        } 
        
        savePath = '/home/ubuntu/api/reports/results_'+testID+'.xlsx';
        var out = fs.createWriteStream (savePath);
        
        out.on ( 'error', function ( err ) {
          console.log ( err );

          console.log ("DONE GENERATING FILE");

        });

        xlsx.generate ( out );

        
      }});

    }



    function prepareReport2(callback){
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
                "To": "e.b.campbelton@gmail.com", 
                "Subject": "Test", 
                "TextBody": "Test Message",
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
