exports.upload = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var filename = req.body.filename; 
 
    var mysql = require('mysql');
   
    var authenticate = require("./auth.js");
     authenticate.authenticate(username,passcode,function(returnValue) {
      if(returnValue){
          var async = require('async');
          async.waterfall([getSigedPOSTurl], function (err, result) { console.log("DONE");  connection.end(); });
      }else{
          connection.end(); 
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



 function getSigedPOSTurl(callback){

        var AWS_ACCESS_KEY = 'AKIAI2PZ6A6BRUEDHHEQ'
        var AWS_SECRET_KEY = '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'
        var S3_BUCKET = 'audio-bkt'

        aws.config.update({
            accessKeyId: AWS_ACCESS_KEY,
            secretAccessKey: AWS_SECRET_KEY
        });

        var s3 = new aws.S3()
        var options = {
            Bucket: S3_BUCKET,
            Key: fileName,
            Expires: stringTimeConvert,
        
            ContentType: flictype,
            ACL: 'public-read'
        }

        s3.getSignedUrl('putObject', options, function(err, data) {
            if (err) return res.send('Error with S3')

            res.json({
                url_for_upload_to_s3: data
            })
        })
}
  	
}