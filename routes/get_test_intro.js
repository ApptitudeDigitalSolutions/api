exports.getTestIntro = function (req, res) {
	var isAdmin = req.body.is_admin;
    var candidatesEmail = req.body.candidate_email;
    var username = req.body.username;
    var passcode = req.body.passcode;

    var testID = req.query.test_id; 
    
    var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var connectionTo_TEST_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'TEST_MACRO' });
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
            var query = 'SELECT * FROM Test_intro_'+testID+';';
            connectionTo_TEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
            

            var testObjects = {pages:[]};


            for(i in rows){
            	var testObject = {question_id:rows[i].question_id ,
            		section_id:rows[i].section_id ,
            		section_title:rows[i].section_title ,
            		section_text:rows[i].section_text ,
					test_info_ref:rows[i].test_info_ref ,
					section_media_url:rows[i].section_media_url ,
					section_media_type:rows[i].section_media_type ,
					section_question_count:rows[i].section_question_count ,
					question:rows[i].question ,
					question_media_url:rows[i].question_media_url ,
					question_media_type:rows[i].question_media_type,
					answer_type:rows[i].answer_type ,
					answer_options:rows[i].answer_options ,
					answer_catergories:rows[i].answer_catergories ,
					correct_answer:rows[i].correct_answer ,
					time_allowed_in_section:rows[i].time_allowed_in_section ,
					test_results_file_ref:rows[i].test_results_file_ref 
            	};	
				testObjects.pages[i].push(testObject);
            }

            console.log(testObject);

          	// were all done creating the payload , itls time send 
          	res.writeHead(200, {
                "Content-Type": "application/json"
            });
            var json = JSON.stringify(objToStringify);
            console.log('RES QUESTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + json);
            res.end(json);
            connectionTo_TEST_MACRO.end();

        	}});

        }
}