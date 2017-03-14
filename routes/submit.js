exports.submit = function (req, res) {

var ACID = req.body.ACID;
var username = req.body.username;
var passcode = req.body.passcode;
var officegen = require('officegen');

var candidate_ids={};
var company_info= {};
var assessment_centre_info = {};

var mysql = require('mysql');
var connectionAC_MACRO = mysql.createConnection({ host: req.app.locals.AC_MACRO_DB_HOST, user: req.app.locals.AC_MACRO_DB_USER, password: req.app.locals.AC_MACRO_DB_PASSWORD, database: req.app.locals.AC_MACRO_DB_NAME });
connectionAC_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

var connectionMACRO = mysql.createConnection({ host: req.app.locals.MACRO_DB_HOST, user: req.app.locals.MACRO_DB_USER, password: req.app.locals.MACRO_DB_PASSWORD, database: req.app.locals.MACRO_DB_NAME });
connectionMACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


var authenticate = require("./auth.js");
     authenticate.authenticate(username,passcode,req,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([getCompanyInfoForUser,getAllCandidateIDS,createWordDocReport,uploadFilesToDropBoxFolderForCompany,notifyUserThatReportsHaveBeenGenerated], function (err, result) { console.log("DONE");  connectionAC_MACRO.end(); });
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
        var query = 'SELECT company_id FROM Users WHERE username = '+username+';';
        connectionMACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                
            var query = 'SELECT * FROM companies WHERE id = '+rows[0].company_id+';';
            connectionMACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                  company_info = rows;
                  callback(null);
            }});

              callback(null);
          }});
  } 

  function getAllCandidateIDS(callback){
  			var query = 'SELECT id FROM Assessment_Center_candidates_'+ACID+';';
            connectionAC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
              candidate_ids = rows;
              callback(null);
        	}});
  } 

  function createWordDocReport(callback){
    for(i in rows){
      var docx = officegen ( 'docx' );
      var pObj = docx.createP ();
      pObj.options.align = 'right';

    }
  } 

  function createExcelReport(callback){
      var xlsx = officegen ( 'xlsx' );

  } 

  function uploadFilesToDropBoxFolderForCompany(callback){

  } 

  function notifyUserThatReportsHaveBeenGenerated(callback){
  	console.log("Body be > " + req.body);

	// Require
	var postmark = require("postmark");

	// Example request
	var client = new postmark.Client("7424f227-688f-4979-93ac-e7b35d2de10d");

	client.sendEmail({
	    "From": "elliot.campbelton@apptitudedigitalsolutions.com",
	    "To": "e.b.campbelton@gmail.com",
	    "Subject": "Test", 
	    "TextBody": req.body
	});
  } 

}