exports.play = function (req, res) {
    var usersname = req.body.username;
    var passcode = req.body.passcode;
    var company_id = req.body.companyID; 
    var recordID = req.query.record_id; 
    var interviewID = req.query.interview_id; 
    
    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var connectionTo_INTERVIEW_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'INTERVIEW_MACRO' });
    connectionTo_INTERVIEW_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


    var async = require('async');
    async.series([function(callback) {
            playFunction(callback);
    }]);

    function playFunction(callback) {
                    memcached.get(username, function(err, result) {

                    if (err) {
                        console.error(err)
                    };
                    console.dir(result);
                    if (result == passcode) {
                          connection.end();
                          getSigedGETurl();

                    } else {
                    
                        if (result == '' || result == undefined) {

                             var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error : The SQL statement is realy batty'); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        getSigedGETurl();
                                        
                                    }
                                }});
                                connection.end();
                           
                    }
                  }
         });
    }


 function getSigedGETurl(callback){


 	var query = 'SELECT * FROM Interview_Results_'+ interviewID +' WHERE answer_wav =\'' + recordID + '\';';
    connectionTo_INTERVIEW_MACRO.query(query, function(err, rows) {if (err) { console.log('Error : The SQL statement is realy batty'); return;} else {
                            
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
    connectionTo_INTERVIEW_MACRO.end();				
}
}