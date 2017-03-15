exports.submit = function (req, res) {

var ACID = req.body.ACID;
var username = req.body.username;
var passcode = req.body.passcode;
var officegen = require('officegen');

var candidates_info={};
var company_info= {};
var assessment_centre_info = {};
var assessment_centre_activities_info = {};
var allReviewQuestionsForAllActivities = [];

var docxObjectsArray = [];
var activities = [];

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd='0'+dd
} 

if(mm<10) {
    mm='0'+mm
} 

today = mm+'/'+dd+'/'+yyyy;

var mysql = require('mysql');
var connectionAC_MACRO = mysql.createConnection({ host: req.app.locals.AC_MACRO_DB_HOST, user: req.app.locals.AC_MACRO_DB_USER, password: req.app.locals.AC_MACRO_DB_PASSWORD, database: req.app.locals.AC_MACRO_DB_NAME });
connectionAC_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

var connectionMACRO = mysql.createConnection({ host: req.app.locals.MACRO_DB_HOST, user: req.app.locals.MACRO_DB_USER, password: req.app.locals.MACRO_DB_PASSWORD, database: req.app.locals.MACRO_DB_NAME });
connectionMACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


var authenticate = require("./auth.js");
     authenticate.authenticate(username,passcode,req,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([getCompanyInfoForUser,getAllCandidateIDS,getAC,getAllActivities,getActivitiesQuestions,createWordDocReport,responce], function (err, result) { console.log("DONE");  connectionAC_MACRO.end(); });
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


  function getCompanyInfoForUser(callback){
        var query = 'SELECT company_id FROM Users WHERE username = \''+username+'\';';
        connectionMACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                

            var query = 'SELECT * FROM Companies WHERE id = '+rows[0].company_id+';';
            connectionMACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                  company_info = rows;
                  console.log("Company INFO >>>>> " + company_info);
                  callback(null);
            }});
              
          }});
  } 

  function getAllCandidateIDS(callback){
  			var query = 'SELECT * FROM Assessment_Center_candidates_'+ACID+';';
            connectionAC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
              candidates_info = rows;
              console.log("Candidates INFO >>>>> " + candidates_info);
              callback(null);
        	}});
  } 


function getAC(callback){
          var query = 'SELECT * FROM Assessment_Center_templates WHERE id = '+ACID+';';
            connectionAC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
              assessment_centre_info = rows;
              console.log("Assessment Center INFO >>>>> " + assessment_centre_info);
              callback(null);
          }});
  }


  function getAllActivities(callback){
          var query = 'SELECT * FROM Assessment_Center_activities WHERE ac_id = '+ACID+';';
            connectionAC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
              assessment_centre_activities_info = rows;
              console.log("Assessment Center Activities INFO >>>>> " + assessment_centre_activities_info);
              callback(null);
          }});
  }


  function getActivitiesQuestions(callback){
        activities = assessment_centre_info[0].activity_types.split(",");
        var query;
        for(i in activities){

            if(activities[i] == "i"){
                query = 'SELECT * FROM Interview_review_questions_'+ACID+';';
            }
            if(activities[i] == "p"){
                query = 'SELECT * FROM Presentation_review_questions_'+ACID+';'; 
            }
            if(activities[i] == "rp"){
                query = 'SELECT * FROM Roleplay_review_questions_'+ACID+';'; 
            }


            connectionAC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
               allReviewQuestionsForAllActivities.push(rows);

               if(allReviewQuestionsForAllActivities.length == activities.length){
                  console.log("AllReviewQuestions INFO >>>>> " + allReviewQuestionsForAllActivities);
                  callback(null);
               }
            }});
        }
  }


  function createWordDocReport(callback){

    var currentActivityBringProcessed = 0;
    for(i in candidates_info){

        console.log("Candidate PROCESSING  >>>>> " + candidates_info[i]);
        // add ac info to report 
        var info = {title:assessment_centre_info[0].title,
                    candidate_name:candidates_info[i].First + " " + candidates_info[i].Last,
                    assessor_name: username,
                    date: today,
                    activities:[]};

        console.log(info);

        for ( j in assessment_centre_activities_info){
          var activity_results_for_candidate ={};
          var query;

          if(assessment_centre_activities_info[j].activity_type == "i"){
            query = 'SELECT * FROM Interview_review_results_'+ACID+' WHERE candidate_id = '+candidates_info[i].id+' ORDER BY question_id DESC;';
          }

          if(assessment_centre_activities_info[j].activity_type == "p"){
            query = 'SELECT * FROM Presentation_review_results_'+ACID+' WHERE candidate_id = '+candidates_info[i].id+' ORDER BY question_id DESC;';
          }

          if(assessment_centre_activities_info[j].activity_type == "rp"){
            query = 'SELECT * FROM Roleplay_review_results_'+ACID+' WHERE candidate_id = '+candidates_info[i].id+' ORDER BY question_id DESC;';
          }

// get index of activity 
          var indexOfActivityInArray = 0;
          console.log("THE activiites are " + activities);
          for(f in activities){
             console.log("THE activiites IS " + activities[f]);
            if(activities[f] == assessment_centre_activities_info[j].activity_type){
                indexOfActivityInArray = f;
            }
          }

          grabDataAndFormat(query,indexOfActivityInArray);

          //   connectionAC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
          //     activity_results_for_candidate = rows;
             
          //     // for every activity get the results for a particular user 
          //     var activity_report = {acticity_type:assessment_centre_activities_info[j].activity_type,
          //                           activity_report_intro:assessment_centre_activities_info[j].actiity_report_intro_text,
          //                           activity_report_intro_table:[],
          //                           activity_performace_overview_table:[],
          //                           activity_report_components:[]
          //                         }

          //   // FILLING IN activity_report_intro_table




          //   // FILLING IN activity_performace_overview_table

          //   console.log("THE VALUE OF J = " + j);

          //   console.log("initial review >> " + allReviewQuestionsForAllActivities[currentActivityBringProcessed]);
          //   console.log("The First Line is : " + allReviewQuestionsForAllActivities[currentActivityBringProcessed][0].review_question);
          //               // FILLING IN activity_report_components
          //   activity_report.activity_report_components.push({title:allReviewQuestionsForAllActivities[currentActivityBringProcessed][0].review_question,table:[]});

          //   console.log("table >  " + JSON.stringify(activity_report));

          //   for(m in activity_results_for_candidate){
          //     var stringToInserIntoCell = activity_results_for_candidate[m].question_id+"|"+activity_results_for_candidate[m].answer_text+"|"+activity_results_for_candidate[m].answer_type;
          //     console.log(stringToInserIntoCell);
          //     console.log("table >  " + JSON.stringify(activity_report.activity_report_components[j]));
          //     activity_report.activity_report_components[j].table.push({cell:stringToInserIntoCell});
          //   }

          // }});

            // if(j == assessment_centre_activities_info.length){

            //     console.log("The Final JSON object looks like" + info);

            //     // pass to create wizard
            //     var docGen = require("./WordDocGen.js");
            //     currentActivityBringProcessed++;
            //     docGen.generate(info,ACID,function(returnValue) {
            //       if(returnValue ==true){
            //         console.log("The doc has been generated");
            //       }else{
            //         console.log("Error Generating Doc");
            //       }
            //     });

            // }
        }

        
        // now on to generate the next report
      }
  
  }


  function grabDataAndFormat(query,indexOfActivityInArray){

      connectionAC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
              activity_results_for_candidate = rows;
             
              // for every activity get the results for a particular user 
              var activity_report = {
                                    acticity_type:assessment_centre_activities_info[j].activity_type,
                                    activity_report_intro:assessment_centre_activities_info[j].actiity_report_intro_text,
                                    activity_report_intro_table:[],
                                    activity_performace_overview_table:[],
                                    activity_report_components:[]
                                  }

            // FILLING IN activity_report_intro_table




            // FILLING IN activity_performace_overview_table

            console.log("THE VALUE OF J = " + j);

            console.log("initial review >> " + allReviewQuestionsForAllActivities[indexOfActivityInArray]);
            console.log("The First Line is : " + allReviewQuestionsForAllActivities[indexOfActivityInArray][0].review_question);
                        // FILLING IN activity_report_components
            activity_report.activity_report_components.push({title:allReviewQuestionsForAllActivities[indexOfActivityInArray][0].review_question,table:[]});

            console.log("table >  " + JSON.stringify(activity_report));

            for(m in activity_results_for_candidate){
              var stringToInserIntoCell = activity_results_for_candidate[m].question_id+"|"+activity_results_for_candidate[m].answer_text+"|"+activity_results_for_candidate[m].answer_type;
              console.log(stringToInserIntoCell);
              console.log("table >  " + JSON.stringify(activity_report.activity_report_components[j]));
              activity_report.activity_report_components[j].table.push({cell:stringToInserIntoCell});
            }


             console.log("The Final JSON object looks like" + info);

                // pass to create wizard
                var docGen = require("./WordDocGen.js");
                
                docGen.generate(info,ACID,function(returnValue) {
                  if(returnValue ==true){
                    console.log("The doc has been generated");
                  }else{
                    console.log("Error Generating Doc");
                  }
                });


          }});

  }

  function responce(callback){
          res.writeHead(200, {
              "Content-Type": "application/json"
          });
          var json = JSON.stringify({
             status:"unauthorized"
              });
          res.end(json);
  } 

}