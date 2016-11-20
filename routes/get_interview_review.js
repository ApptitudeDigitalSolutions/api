exports.get_interview_review = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var ac_id = req.params.ac_id; 
    var isValid = 0;

    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var connectionTo_AC_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'AC_MACRO' });
    connectionTo_AC_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


    var async = require('async');
    async.series([function(callback) {
            auth(callback);
    }]);

    function auth(callback) {
                  var Memcached = require('memcached');
                  var memcached = new Memcached('localhost:11211');
                    memcached.get(username, function(err, result) {

                    if (err) {
                        console.error(err)
                    };
                    console.dir(result);
                    if (result == passcode) {
                        // perform get of all interviews
                            connection.end();
                            getReviewPages();
                    } else {
                    
                        if (result == '' || result == undefined) {

                             var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        getReviewPages();
                                        
                                    }
                                }});
                                connection.end();

                            
                    }
                  }
         });
    }


    function getReviewPages(callback){
    		// get count of sections
    		var query = 'SELECT * FROM Interview_review_questions_'+ac_id+';';
            connectionTo_AC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
            
            var objToStringify = {pages:[]};

            for(i in rows){
            		var page = {    review_question_id:rows[i].review_question_id,
                                    review_question:rows[i].review_question,
                                    positive_indicators:rows[i].positive_indicators,
                                    negative_indicators:rows[i].negative_indicators
                                };
                                
                    objToStringify.pages.push(page);
            }

          	// were all done creating the payload , itls time send 
          	res.writeHead(200, {
                "Content-Type": "application/json"
            });
            var json = JSON.stringify(objToStringify);
            console.log('REVIEW PAGES  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + json);
            res.end(json);
            connectionTo_AC_MACRO.end();

        	}});

    }
}
