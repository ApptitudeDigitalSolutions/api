exports.confirmUpload = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var aw = req.query.wavFileName; 
    var qid = req.body.question_id;
    var sid = req.body.section_id;
    var at = req.body.answer_text;
    var an = req.body.answer_notes;
    var interviewID = req.body.interview_id;
    var candidateID = req.query.candidate_id; 
    
    var mysql = require('mysql');
    
     var connectionAC_MACRO = mysql.createConnection({ host: req.app.locals.AC_MACRO_DB_HOST, user: req.app.locals.AC_MACRO_DB_USER, password: req.app.locals.AC_MACRO_DB_PASSWORD, database: req.app.locals.AC_MACRO_DB_NAME });
    connectionAC_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

     var authenticate = require("./auth.js");
    authenticate.authenticate(req,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([confrim], function (err, result) { console.log("DONE");  connectionAC_MACRO.end(); });
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


 function confrim(callback){
        var query = 'INSERT INTO Interview_results_'+interviewID+' (candidate_id,question_id,section_id,answer_text,answer_wav,answer_notes) VALUES ('+candidateID+','+qid+','+sid+','+at+','+aw+','+an+');';
        connectionAC_MACRO.query(query, function(err, rows) {if (err) { console.log('Err SQL' + err); return;} else {

           res.end(200);
        }});
        connectionAC_MACRO.end();
}
  	
}