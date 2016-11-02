exports.getTest = function (req, res) {
    var usersname = req.body.username;
    var passcode = req.body.passcode;
    var testKey = req.body.test_key;
    var isAdmin = req.body.is_admin;
    var candidatesEmail = req.body.candidate_email;
    var testID = req.query.test_id; 
    var isValid = 0;

    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var connectionTo_TEST_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'INTERVIEW_MACRO' });
    connectionTo_TEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


    var async = require('async');
    async.series([function(callback) {
        if(isAdmin == '1' && candidatesEmail =='' && username != '' && passcode !=''){
            // we need to authenticate 
            authenticateAsAdmin(callback);
        }

        if(candidatesEmail != '' && isAdmin == '' && username == '' && passcode ==''){
            // this is a test participant and hence we need to send them down the other way 
            authenticateAsParticipant(callback);
        }


    }]);

  
    function authenticateAsAdmin(callback) {
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
                            formatJsonForTest();
                    } else {
                    
                        if (result == '' || result == undefined) {

                             var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connection.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        formatJsonForTest();
                                        
                                    }
                                }});
                                connection.end();

                            
                    }
                  }
         });
    }




    function authenticateAsParticipant(callback) {
         var query = 'SELECT * FROM Test_applicants_'+testID+' WHERE email =\'' + candidatesEmail + '\';';
            connectionTo_TEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
        
                storedPasscode = rows[0].passcode;
                if (rows.length > 0){

                    formatJsonForTest();
                    
                }else{
                    res.end(401);
                }
            }});
            connectionTo_TEST_MACRO.end();        
    }




    function formatJsonForTest(callback){

// get the test meta data.
// get count of sections in this test
            var query = 'SELECT * FROM Test_templates WHERE id = '+testID+';';
            connectionTo_TEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
            
            var objToStringify = {  test_id: rows[0].id,
                                    test_title: rows[0].test_title,
                                    to_be_conducted_on:rows[0].to_be_conducted_on,
                                    sections:[]
                                 };

            		// get count of sections in this test
            		var query = 'SELECT section_id FROM Test_'+testID+' ORDER BY section_id DESC LIMIT 1;';
                    connectionTo_TEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

                    var sectionNumberCount = rows[0].section_id;
                    
                    for(i =1; i< sectionNumberCount;){

                    	// we need to first get all meta data for the section

                    	var sectionInfoQuery = 'SELECT * Test_'+testID+' WHERE section_id = '+i+' ORDER BY question_id ASC;';
                    	connectionTo_TEST_MACRO.query(sectionInfoQuery, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                    		//1. strip out the section info  
                    		var sectionTitle = rows[i].section_title;
                    		var sectionText = rows[i].section_text;
                    		var sectionMediaURL = rows[i].section_media_url;
                    		var sectionMediaType = rows[i].section_media_type;
                            var time_allowed_in_section = rows[i].time_allowed_in_section;
                            var section_question_count = rows[i].section_question_count;
                            var in_test_info_url = rows[i].test_info_ref;

                    		var sectionJSONObject ={title: sectionTitle,
                                                    section_media_url: sectionMediaURL,
                                                    section_media_type: sectionMediaType,
                                                    section_text: sectionText,
                                                    time_allowed_in_section: time_allowed_in_section,
                                                    section_question_count:section_question_count,
                                                    in_test_info_url: in_test_info_url,
                                                    questions:[]};

                            objToStringify.sections[i].push(sectionJSONObject);

                    		console.log("That JSON blob for section : "+ i + " looks like > " + JSON.stringify(sectionJSONObject));

                    		// now we need to add the questions for this section
                    		for(j in rows){

                    			if(rows[j].question != ''){
                    				var questionID = rows[j].question_id;
                                    var question_media_url = rows[j].question_media_url;
                                    var question_media_type = rows[j].question_media_type;
                                    var question = rows[j].question;
                                    var answer_type = rows[j].answer_type;
                                    var answer_options = rows[j].answer_options;
                                    var answer_catergories = rows[j].answer_catergories;


                    				// format the josn object for this question
                    				var questionJSONObj = {
                                                            question_id: questionID,
                                                            question_media_url: question_media_url,
                                                            question_media_type: question_media_type,
                                                            question: question,
                                                            answer_type: answer_type,
                                                            answer_options: answer_options,
                                                            answer_catergories: answer_catergories
                                                        };

                    				objToStringify.sections[i].questions.push(questionJSONObj);

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
                    console.log('RES QUESTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + json);
                    res.end(json);
                    connectionTo_TEST_MACRO.end();

                	}});

        }});
    }
}
