exports.getInterviewDetails = function (req, res) {
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
            getInterviewsFunction(callback);
    }]);

    function getInterviewsFunction(callback) {
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
                            formatJsonForAllInterviews();
                    } else {
                    
                        if (result == '' || result == undefined) {

                             var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        formatJsonForAllInterviews();
                                        
                                    }
                                }});
                                connection.end();

                            
                    }
                  }
         });
    }


    function formatJsonForAllInterviews(callback){
    		// get count of sections
    		var query = 'SELECT * FROM Interview_questions_'+ac_id+';';
            connectionTo_AC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
            
            var objToStringify = {pages:[]};

            for(i in rows){
            		var page = {    id:rows[i].id,
                                    question_id:rows[i].question_id,
                                    section_id:rows[i].section_id,
                                    section_title:rows[i].section_title,
                                    section_text:rows[i].section_text,
                                    section_media_url:rows[i].section_media_url,
                                    section_media_type:rows[i].section_media_type,
                                    question:rows[i].question,
                                    prompts:rows[i].prompts,
                                    answer_type:rows[i].answer_type,
                                    answer_options:rows[i].answer_options,
                                    type:rows[i].type
                                };
                                
                    objToStringify.pages.push(page);
            }

            console.log(objToStringify);

          	// were all done creating the payload , itls time send 
          	res.writeHead(200, {
                "Content-Type": "application/json"
            });
            var json = JSON.stringify(objToStringify);
            console.log('RES QUESTIONS + PROMPTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + json);
            res.end(json);
            connectionTo_AC_MACRO.end();

        	}});

    }
}
