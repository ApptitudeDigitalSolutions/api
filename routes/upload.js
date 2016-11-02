exports.upload = function (req, res) {
    var usersname = req.body.username;
    var passcode = req.body.passcode;
    var filename = req.body.filename; 
 
    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var async = require('async');
    async.series([function(callback) {
            uploadFunction(callback);
    }]);

    function uploadFunction(callback) {
                  var Memcached = require('memcached');
                  var memcached = new Memcached('localhost:11211');
                    memcached.get(username, function(err, result) {

                    if (err) {
                        console.error(err)
                    };
                    console.dir(result);
                    if (result == passcode) {
                          connection.end();
                          getSigedPOSTurl();

                    } else {
                    
                        if (result == '' || result == undefined) {

                             var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error : The SQL statement is realy batty'); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        getSigedPOSTurl();
                                        
                                    }
                                }});
                                connection.end();
                           
                    }
                  }
         });
    }


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