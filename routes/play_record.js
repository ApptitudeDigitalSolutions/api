exports.play = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var company_id = req.body.companyID; 
    var recordID = req.query.record_id; 
    var interviewID = req.query.interview_id; 
    
    var mysql = require('mysql');
   
    var connectionAC_MACRO = mysql.createConnection({ host: req.app.locals.AC_MACRO_DB_HOST, user: req.app.locals.AC_MACRO_DB_USER, password: req.app.locals.AC_MACRO_DB_PASSWORD, database: req.app.locals.AC_MACRO_DB_NAME });
    connectionAC_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


    var authenticate = require("./auth.js");
     authenticate.authenticate(username,passcode,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([getSigedGETurl], function (err, result) { console.log("DONE");  connectionAC_MACRO.end(); });
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



 function getSigedGETurl(callback){


 	var query = 'SELECT * FROM Interview_Results_'+ interviewID +' WHERE answer_wav =\'' + recordID + '\';';
    connectionAC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error : The SQL statement is realy batty'); return;} else {
                            
           if (rows.length > 0){
    				
    				var AWS_ACCESS_KEY = 'AKIAI2PZ6A6BRUEDHHEQ'
					var AWS_SECRET_KEY = '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'
					var S3_BUCKET = 'audio-bkt'

    			 	res.writeHead(200, {
                        "Content-Type": "application/json"
                    });

                    aws.config.update({
                        accessKeyId: AWS_ACCESS_KEY,
                        secretAccessKey: AWS_SECRET_KEY
                    });
                    var s3 = new aws.S3();
                    //aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
                    var params = {
                        Bucket: S3_BUCKET,
                        Key: resourceID
                    };

                    s3.getSignedUrl('getObject', params, function(err, url) {
                        //console.log("The URL is", url);
                        res.json({
                            playable_URL: url,
                            resource: recordID
                        });

                    });
        }
    }});
    connectionAC_MACRO.end();				
}
}