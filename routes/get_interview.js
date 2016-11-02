exports.getInterviewDetails = function (req, res) {
    var usersname = req.body.username;
    var passcode = req.body.passcode;
    var interviewID = req.query.interview_id; 
    var isValid = 0;

    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var connectionTo_INTERVIEW_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'INTERVIEW_MACRO' });
    connectionTo_INTERVIEW_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


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
    		var query = 'SELECT section_id FROM Interview_questions_'+interviewID+' ORDER BY section_id DESC LIMIT 1;';
            connectionTo_INTERVIEW_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
            
            var objToStringify = {interview_payload:[]};

            var sectionNumberCount = rows[0].section_id;

            for(i =1; i< sectionNumberCount;){

            	// we need to first get all meta data for the section  and add to the object to return 
            	var sectionInfoQuery = 'SELECT * FROM Interview_questions_'+interviewID+' WHERE section_id = '+i+' ORDER BY question_id ASC;';
            	connectionTo_INTERVIEW_MACRO.query(sectionInfoQuery, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
            		//1. strip out the section info  
            		var sectionTitle = rows[0].section_title;
            		var sectionText = rows[0].section_text;
            		var sectionMediaURL = rows[0].section_media_url;
            		var sectionMediaType = rows[0].section_media_type;

            		var sectionAndQuestionsJSONObject = {section_id:i,
            											 section_into_text: sectionText,
            											 section_media_url: sectionMediaURL,
            											 section_media_type: sectionMediaType,
            											 questions:[]};
            		console.log("That JSON blob for section : "+ i + " looks like > " + JSON.stringify(sectionAndQuestionsJSONObject));

            		// now we need to add the questions for this section
            		for(j in rows){

            			if(rows[j].question != ''){
            				var questionID = rows[j].question_id;
            				var sectionIDNow = i; 
            				var question = rows[j].question;
            				var prompts= rows[j].prompts

            				// format the josn object for this question

            				var questionJSONObj = {question_id : questionID, section_id:sectionIDNow,question:question,prompts:prompts};
            				sectionAndQuestionsJSONObject.questions.push(questionJSONObj);

            				console.log("QUESTION "+ questionID + " in sec_"+i+" > " + JSON.stringify(questionJSONObj));
            			}

            		}

            	}});

            	i++;// all done in this section we move on to the next section
            }

          	// were all done creating the payload , itls time send 
          	res.writeHead(200, {
                "Content-Type": "application/json"
            });
            var json = JSON.stringify(objToStringify);
            console.log('RES QUESTIONS + PROMPTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + json);
            res.end(json);
            connectionTo_INTERVIEW_MACRO.end();

        	}});
    }
}
