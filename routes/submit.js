exports.submit = function (req, res) {

var ACID = req.body.ACID;
var username = req.body.username;
var passcode = req.body.passcode;
var officegen = require('officegen');

var candidates_info={};
var company_info= {};
var assessment_centre_info = {};
var assessment_centre_activities_info = [];
var allReviewQuestionsForAllActivities = [];

var activityTypesInOrderOfProcessing= [];

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

var async = require('async');

var authenticate = require("./auth.js");
     authenticate.authenticate(username,passcode,req,function(returnValue) {
      if(returnValue){
          
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
             
              callback(null);
        	}});
  } 


function getAC(callback){
          var query = 'SELECT * FROM Assessment_Center_templates WHERE id = '+ACID+';';
            connectionAC_MACRO.query(query, function(err, rows) {if (err) { //console.log('Error SQL :' + err); 
              return;} else {
              assessment_centre_info = rows;
             
              callback(null);
          }});
  }


  function getAllActivities(callback){
          var query = 'SELECT * FROM Assessment_Center_activities WHERE ac_id = '+ACID+';';
            connectionAC_MACRO.query(query, function(err, rows) {if (err) { //console.log('Error SQL :' + err); 
              return;} else {
              //assessment_centre_activities_info = rows;

              // we watn to add these rows to assessment_centre_activities_info only if the activity type is also found in the template
              var hasAdded = false;
              var acts = assessment_centre_info[0].activity_types.split(",");
              console.log(acts);
              for(i in rows){

                for(j in acts){
                  console.log("activity_type = " + rows[i].activity_type + ", acts = " +  acts[j]);
                  if(rows[i].activity_type == acts[j] && hasAdded == false){
                    assessment_centre_activities_info.push(rows[i]);
                    console.log("ADDING ROW " + rows[i]);
                    hasAdded=true;
                  }
                } 
                hasAdded=false;
              }
              //console.log("SUBMIT - Assessment Center Activities INFO >>>>> " +  JSON.stringify(assessment_centre_activities_info));
              callback(null);
          }});
  }


// itterate over the activities,but you need some way of keeping track of which queries were perfomed in what order, and theres no 

  function getActivitiesQuestions(callback){
        activities = assessment_centre_info[0].activity_types.split(",");
        //console.log("THE ACTIVITIES ARE "+ activities + " AND EVENTS COUNT = " + activities.length);
        var query = "";
        for(i in activities){

            if(activities[i] == "i"){
                query = query + 'SELECT * FROM Interview_review_questions_'+ACID+';';
                activityTypesInOrderOfProcessing.push("i");
            }
            if(activities[i] == "p"){
                query = query + 'SELECT * FROM Presentation_review_questions_'+ACID+';'; 
                activityTypesInOrderOfProcessing.push("p");
            }
            if(activities[i] == "rp"){
                query = query + 'SELECT * FROM Roleplay_review_questions_'+ACID+';'; 
                activityTypesInOrderOfProcessing.push("rp");
            }
        }

//// THIS IS WHERE ITS GOING WRONG____T
          connectionAC_MACRO.query(query, function(err, results) {if (err) { //console.log('Error SQL :' + err); 
          return;} else {

            for ( i in results){
              console.log("Adding Questions");
              allReviewQuestionsForAllActivities.push(results[i]);
            }
            console.log(JSON.stringify(allReviewQuestionsForAllActivities));
            callback(null);
        }});
        
  }
//  we need to go per activiry, get the questions and 

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


        var query = "";
        var ACAcitivtyTypes = [];
        for ( j in assessment_centre_activities_info){
          //console.log(assessment_centre_activities_info[j].activity_type);
    
          var activity_results_for_candidate ={};
          
          
          if(assessment_centre_activities_info[j].activity_type == "i"){
            query = query + 'SELECT * FROM Interview_review_results_'+ACID+' WHERE candidate_id = '+candidates_info[i].id+' ORDER BY question_id ASC;';
            ACAcitivtyTypes.push("i");
          }

          if(assessment_centre_activities_info[j].activity_type == "p"){
            query = query + 'SELECT * FROM Presentation_review_results_'+ACID+' WHERE candidate_id = '+candidates_info[i].id+' ORDER BY question_id ASC;';
             ACAcitivtyTypes.push("p");
          }

          if(assessment_centre_activities_info[j].activity_type == "rp"){
            query = query + 'SELECT * FROM Roleplay_review_results_'+ACID+' WHERE candidate_id = '+candidates_info[i].id+' ORDER BY question_id ASC;';
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

          async.waterfall([async.apply(grabDataAndFormat,query,ACAcitivtyTypes,info)], function (err, result) { console.log("DONE"); });
         
        }
        callback(null);

  }


  function grabDataAndFormat(query,ACAcitivtyTypes,info){
      
      connectionAC_MACRO.query(query, function(err, results) {if (err) 
              console.log(err);
                {

                  // ok so now we have the answers and the questions, we need to itterate over the questiosn and get the question, then grab the answes for each candidate

                  // so we begin with the for loop
                var hasAddedContent = false;

                 for(A in results){

                      if(results[A].length > 0){
                        hasAddedContent = true;
                        //console.log("Arry of tag = " + ACAcitivtyTypes[A]);
                        //console.log(JSON.stringify(results[A]));
                        // this means there are results of this acticity , question is  which activity was it 
                        // we know this by getting the 

                        // so we do need to knwo the index becasue of the review quesitons 
                        var indexOfQuestionsForACActivity = 0;
                        if(ACAcitivtyTypes[A] == "i"){
                          // now we need to get the index of the questions array block
                          for(B in activityTypesInOrderOfProcessing){
                          if (activityTypesInOrderOfProcessing[B] == "i"){
                            indexOfQuestionsForACActivity = B;
                          }
                          }
                        }

                        if(ACAcitivtyTypes[A] == "p"){
                          // now we need to get the index of the questions array block
                          for(B in activityTypesInOrderOfProcessing){
                          if (activityTypesInOrderOfProcessing[B] == "p"){
                            indexOfQuestionsForACActivity = B;
                          }
                          }
                        }

                        if(ACAcitivtyTypes[A] == "rp"){
                          // now we need to get the index of the questions array block
                          for(B in activityTypesInOrderOfProcessing){
                          if (activityTypesInOrderOfProcessing[B] == "rp"){
                            indexOfQuestionsForACActivity = B;
                          }
                          }
                        }



                        //console.log("Index for quesitons = " + indexOfQuestionsForACActivity + " for results at index " + A + " for activty tupe " + ACAcitivtyTypes[A]);


                        // ok now we can fill out the JSON objects
                        // object ={};
                        //console.log(" Activity type = "+ ACAcitivtyTypes[A]+ " Number of q's = " + allReviewQuestionsForAllActivities[indexOfQuestionsForACActivity].length+ " and Q's" + JSON.stringify(allReviewQuestionsForAllActivities[indexOfQuestionsForACActivity]) + " " )
                         for(c in allReviewQuestionsForAllActivities[indexOfQuestionsForACActivity]){
                          
                          //console.log("QUESTIONs = " + JSON.stringify(allReviewQuestionsForAllActivities[indexOfQuestionsForACActivity][c].review_question_id));
                          var x = allReviewQuestionsForAllActivities[indexOfQuestionsForACActivity][c].review_question_id;
                          var y = allReviewQuestionsForAllActivities[indexOfQuestionsForACActivity][c].review_question;

                          console.log("THIS QUESTION IS " + JSON.stringify(y));
                          // now we need to see if there are answes to this question int he results block provioded
                          // now we itterate over the answers to that question and add them as needed 
                          var areAnswersFOrQuestion = false;
                          var object = {title:y 
                                    ,table:[]};
                          object.table.push({cells:"Catergory|Answer"}); 

                          for(d in results[A]){
                                 // console.log(allReviewQuestionsForAllActivities);
                                console.log("q id = "+ results[A][d].question_id + " and aq id = " + JSON.stringify(allReviewQuestionsForAllActivities[indexOfQuestionsForACActivity][c].review_question_id));
                                  if(results[A][d].question_id == x){
                                    areAnswersFOrQuestion = true;
                                  }
                                

                                if(areAnswersFOrQuestion){
                                    // object = {title:y 
                                    //        ,table:[]};
                                    
                                    //console.log("THIS QUESTION IS " + JSON.stringify(object.title));
                                    // object.table.push({cells:"Catergory|Answer"});                       // get the answers and add them to the cells array  
                                    // for(c in results[A]){
                                    // now we need to format the cells and add them
                                        var answerType = "";
                                        if(results[A][d].answer_type == "pi"){
                                            answerType = "Positive";
                                        }
                                        if(results[A][d].answer_type == "ni"){
                                            answerType = "Negative";
                                        }
                                        if(results[A][d].answer_type == "ac"){
                                            answerType = "Commnet";
                                        }
                                        if(results[A][d].answer_type == "s"){
                                            answerType = "Score";
                                        }

                                      var stringToInserIntoCell = answerType+"|"+results[A][d].answer_text;
                                      console.log("PUSHING " + stringToInserIntoCell);
                                        object.table.push({cells:stringToInserIntoCell});
                                        console.log(JSON.stringify(object));
                            
                                   // }
                                                         
                              }

                              areAnswersFOrQuestion = false;

                          }
                          //indexOfQuestionsForACActivity++;
                          if(JSON.stringify(object) != "{}"){
                          console.log("ADDING OBJECT"+JSON.stringify(object));
                          info.activities[A].activity_report_components.push(object);
                        }
                      }
                        

                    } 

                 }

               
            // ok now we need to clean up the JSON, we need to remove items from the activities set that have no activity_report_components

            for(itter in info.activities){
              // console.log("COMPONETS " + JSON.stringify(info.activities[itter].activity_report_components));
              if(info.activities[itter].activity_report_components.length < 1){
                // we need to remove the object as its empty 
                info.activities.splice(itter,1);
              }
            }

            if(info.activities.length > 0){
             //console.log("SUBMIT - The Final JSON object looks like >> " + JSON.stringify(info));

                // pass to create wizard

                var docGen = require("./WordDocGen.js");
                
                docGen.generate(info,ACID,function(returnValue) {
                  if(returnValue ==true){
                    //console.log("The doc has been generated");
                  }else{
                    //console.log("Error Generating Doc");
                  }
                });
            }else{
              console.log("No info for candidate" + info.candidate_name);
            }


          }});
      //callback(null);
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







