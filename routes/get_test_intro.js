exports.getTestIntro = function (req, res) {
	var isAdmin = req.body.is_admin;
    var candidatesEmail = req.body.candidate_email;
    var username = req.body.username;
    var passcode = req.body.passcode;

    var testID = req.params.test_id; 

    console.log(req.body);
    
    var mysql = require('mysql');
    var connectionTEST_MACRO = mysql.createConnection({ host: req.app.locals.TEST_MACRO_DB_HOST, user: req.app.locals.TEST_MACRO_DB_USER, password: req.app.locals.TEST_MACRO_DB_PASSWORD, database: req.app.locals.TEST_MACRO_DB_NAME });
    connectionTEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


     var connectionMACRO = mysql.createConnection({ host: req.app.locals.USERS_DB_HOST, user: req.app.locals.USERS_DB_USER, password: req.app.locals.USERS_DB_PASSWORD, database: req.app.locals.USERS_DB_NAME});
    connectionMACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


    var async = require('async');
    async.series([function(callback) {
     	
     	howToAuth();

    }]);

    function howToAuth(callback){
    	if(isAdmin == '1' && username != '' && passcode !=''){
            // we need to authenticate 
            console.log("Auth as a admin");
            authenticateAsAdmin(callback);
        }

        if(candidatesEmail != '' && isAdmin == '0'){
            // this is a test participant and hence we need to send them down the other way 
            console.log("Auth as a test participant");
            authenticateAsParticipant(callback);
        }else{
        	console.log("roger");
        }

    }

  
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
                            connectionMACRO.end();
                            formatJsonForTest();
                    } else {
                    
                        if (result == '' || result == undefined) {

                             var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                                connectionMACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
                            
                                    storedPasscode = rows[0].passcode;
                                    if (passcode == storedPasscode){

                                        formatJsonForTest();
                                        
                                    }
                                }});
                                connectionMACRO.end();
                    }
                  }
         });
    }




    function authenticateAsParticipant(callback) {
         var query = 'SELECT * FROM Test_applicants_'+testID+' WHERE email =\'' + candidatesEmail + '\';';
         console.log(query);
            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
        
                if (rows.length > 0){

                    formatJsonForTest();
                    
                }else{
                    res.end(401);
                }
            }});
                   
    }




    function formatJsonForTest(callback){

// get the test meta data.
// get count of sections in this test
            var query = 'SELECT * FROM Test_intro_'+testID+';';
            console.log(query);
            connectionTEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
            

            var testObjects = {pages:[]};


            for(i in rows){
            	var testObject = {
            		id:rows[i].id ,
            		question_id:rows[i].question_id ,
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
					test_results_file_ref:rows[i].test_results_file_ref ,
					macro_section_type: rows[i].macro_section_type,
					should_show_next: rows[i].should_show_next
            	};	

            	console.log(testObject);
				testObjects.pages.push(testObject);
            }

            console.log(testObjects);

          	// were all done creating the payload , itls time send 
          	res.writeHead(200, {
                "Content-Type": "application/json"
            });
            var json = JSON.stringify(testObjects);
            console.log('INTRO QUESTIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + json);
            res.end(json);
            connectionTEST_MACRO.end();

        	}});

        }
}