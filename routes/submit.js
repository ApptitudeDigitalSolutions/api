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

var TEMPLATE = {};

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
var connectionAC_MACRO = mysql.createConnection({ host: req.app.locals.AC_MACRO_DB_HOST, user: req.app.locals.AC_MACRO_DB_USER, password: req.app.locals.AC_MACRO_DB_PASSWORD, database: req.app.locals.AC_MACRO_DB_NAME , multipleStatements:true});
connectionAC_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

var connectionMACRO = mysql.createConnection({ host: req.app.locals.MACRO_DB_HOST, user: req.app.locals.MACRO_DB_USER, password: req.app.locals.MACRO_DB_PASSWORD, database: req.app.locals.MACRO_DB_NAME , multipleStatements:true});
connectionMACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


var authenticate = require("./auth.js");
     authenticate.authenticate(username,passcode,req,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([getCompanyInfoForUser,getAllCandidateIDS,getAC,getAllActivities,getActivitiesQuestions,createWordDocReport,responce], function (err, result) { //console.log("DONE");  
            connectionAC_MACRO.end(); });
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
        connectionMACRO.query(query, function(err, rows) {if (err) { //console.log('Error SQL :' + err); 
          return;} else {
                

            var query = 'SELECT * FROM Companies WHERE id = '+rows[0].company_id+';';
            connectionMACRO.query(query, function(err, rows) {if (err) { //console.log('Error SQL :' + err);
             return;} else {
                  company_info = rows;
                  //console.log("SUBMIT - Company INFO >>>>> " + JSON.stringify(company_info));

                  callback(null);
            }});
              
          }});
  } 

  function getAllCandidateIDS(callback){
  			var query = 'SELECT * FROM Assessment_Center_candidates_'+ACID+';';
            connectionAC_MACRO.query(query, function(err, rows) {if (err) { //console.log('Error SQL :' + err); 
              return;} else {
              candidates_info = rows;
              //console.log("SUBMIT - Candidates INFO >>>>> " +  JSON.stringify(candidates_info));

              TEMPLATE = 
              callback(null);
        	}});
  } 


function getAC(callback){
          var query = 'SELECT * FROM Assessment_Center_templates WHERE id = '+ACID+';';
            connectionAC_MACRO.query(query, function(err, rows) {if (err) { //console.log('Error SQL :' + err); 
              return;} else {
              assessment_centre_info = rows;
              //console.log("SUBMIT - Assessment Center INFO >>>>> " +  JSON.stringify(assessment_centre_info));
              callback(null);
          }});
  }


  function getAllActivities(callback){
          var query = 'SELECT * FROM Assessment_Center_activities WHERE ac_id = '+ACID+';';
            connectionAC_MACRO.query(query, function(err, rows) {if (err) { //console.log('Error SQL :' + err); 
              return;} else {
              assessment_centre_activities_info = rows;
              //console.log("SUBMIT - Assessment Center Activities INFO >>>>> " +  JSON.stringify(assessment_centre_activities_info));
              callback(null);
          }});
  }


  function getActivitiesQuestions(callback){
        activities = assessment_centre_info[0].activity_types.split(",");
      //console.log("THE ACTIVITIES ARE "+ activities + " AND EVENTS COUNT = " + activities.length);
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

//// THIS IS WHERE ITS GOING WRONG____T
            connectionAC_MACRO.query(query, function(err, rows) {if (err) { //console.log('Error SQL :' + err); 
              return;} else {
               allReviewQuestionsForAllActivities.push(rows);

               if(allReviewQuestionsForAllActivities.length == activities.length){
                  //console.log("SUBMIT -  AllReviewQuestions INFO >>>>> " + JSON.stringify(allReviewQuestionsForAllActivities));
                  callback(null);
               }
            }});
        }
  }


  function createWordDocReport(callback){

    var currentActivityBringProcessed = 0;
    for(i in candidates_info){

        // console.log("SUBMIT - Candidate PROCESSING  >>>>> " + JSON.stringify(candidates_info[i]));
        // add ac info to report 
        var info = {title:assessment_centre_info[0].title,
                    candidate_name:candidates_info[i].First + " " + candidates_info[i].Last,
                    assessor_name: username,
                    date: today,
                    activities:[]};

        //console.log(assessment_centre_activities_info);
        var query = "";
        for ( j in assessment_centre_activities_info){
          var activity_results_for_candidate ={};
          
          var ACAcitivtyTypes = [];
          if(assessment_centre_activities_info[j].activity_type == "i"){
            query = query + 'SELECT * FROM Interview_review_results_'+ACID+' WHERE candidate_id = '+candidates_info[i].id+' ORDER BY question_id DESC;';
            ACAcitivtyTypes.push("i");
          }

          if(assessment_centre_activities_info[j].activity_type == "p"){
            query = query + 'SELECT * FROM Presentation_review_results_'+ACID+' WHERE candidate_id = '+candidates_info[i].id+' ORDER BY question_id DESC;';
             ACAcitivtyTypes.push("p");
          }

          if(assessment_centre_activities_info[j].activity_type == "rp"){
            query = query + 'SELECT * FROM Roleplay_review_results_'+ACID+' WHERE candidate_id = '+candidates_info[i].id+' ORDER BY question_id DESC;';
             ACAcitivtyTypes.push("rp");
          }

          info.activities.push({      
                                      acticity_type:assessment_centre_activities_info[j].activity_type,
                                      activity_report_intro:assessment_centre_activities_info[j].actiity_report_intro_text,
                                      activity_report_intro_table:[],
                                      activity_performace_overview_table:[],
                                      activity_report_components:[]
                                });
        }

         grabDataAndFormat(query,ACAcitivtyTypes,info);
         
        }

  }


  function grabDataAndFormat(query,ACAcitivtyTypes,info){
             // console.log(query);
             console.log("CALLED grabDataAndFormat + " + query + " WITH INFO + " + info);
      connectionAC_MACRO.query(query, function(err, results) {if (err) 
              console.log(err);
                { //console.log('Error SQL :' + err); return;} else {
              //activity_results_for_candidate = rows;

              // console.log(info);
               console.log("QUERY 1 " + results[0]); 
               console.log("QUERY 2 " + results[1]); 
               console.log("QUERY 3 " + results[2]); 



              // we should get all results for a candidate in here

              // we want to itterate over all the objects

              // getting and building the json object as per 

              // console.log("CANDIDATE RESULTS <<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>> " + JSON.stringify(rows));
             
              // for every activity get the results for a particular user 
              // var activity_report = {
              //                         acticity_type:assessment_centre_activities_info[theValueOfJ].activity_type,
              //                         activity_report_intro:assessment_centre_activities_info[theValueOfJ].actiity_report_intro_text,
              //                         activity_report_intro_table:[],
              //                         activity_performace_overview_table:[],
              //                         activity_report_components:[]
              //                       }

            // FILLING IN activity_report_intro_table

            // for i in tables 

            // FILLING IN activity_performace_overview_table

            // ok we need to go over each result, then break down 

            //console.log("SUBMIT - THE VALUE OF J = " + theValueOfJ);
           
            // for(mqm in allReviewQuestionsForAllActivities[indexOfActivityInArraySELECTED]){

            //   //console.log("BRESK " + allReviewQuestionsForAllActivities[indexOfActivityInArraySELECTED][0].review_question);
            //    activity_report.activity_report_components.push({title:allReviewQuestionsForAllActivities[indexOfActivityInArraySELECTED][0].review_question,table:[]});

            //   // a new table for each needs to be created

            //    activity_report.activity_report_components[theValueOfJ].table.push({cells:"Questions|Answers|Catergory"});

            // // now we only want to process the results for the current question ( represnted by mqm here )
            //     for(m in activity_results_for_candidate){

            //       if(activity_results_for_candidate[m].question_id == mqm){

            //       var answerType = "";

            //       if(activity_results_for_candidate[m]=="pi"){
            //           answerType = "Positive";
            //       }
            //        if(activity_results_for_candidate[m]=="ni"){
            //           answerType = "Negative";
            //       }
            //        if(activity_results_for_candidate[m]=="s"){
            //           answerType = "Score";
            //       }
            //        if(activity_results_for_candidate[m]=="ac"){
            //           answerType = "Commnet";
            //       }

            //       var stringToInserIntoCell = activity_results_for_candidate[m].question_id+"|"+activity_results_for_candidate[m].answer_text+"|"+answerType;
            //       activity_report.activity_report_components[theValueOfJ].table.push({cells:stringToInserIntoCell});
            //     }

            //   }

            // }

            // info.activities.push(activity_report);
            //  //console.log("SUBMIT - The Final JSON object looks like >> " + JSON.stringify(info));

            //     // pass to create wizard
            //     var docGen = require("./WordDocGen.js");
                
            //     docGen.generate(info,ACID,function(returnValue) {
            //       if(returnValue ==true){
            //         //console.log("The doc has been generated");
            //       }else{
            //         //console.log("Error Generating Doc");
            //       }
            //     });


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







