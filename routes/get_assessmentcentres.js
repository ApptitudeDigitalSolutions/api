exports.getACs = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var company_id = req.params.company_id; 
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

                                        formatJsonForAllInterviews(callback);
                                        
                                    }
                                }});
                                connection.end();

                            
                    }
                  }
         });
    }


    function formatJsonForAllInterviews(callback){

            var query = 'SELECT id,company_id,created_on,participants_count,title, description, DATE_FORMAT(to_be_conducted_on,GET_FORMAT(DATE,\'EUR\')) as to_be_conducted_on , activity_ids, activity_types FROM Assessment_Center_templates WHERE company_id =\'' + company_id + '\';';
            connectionTo_AC_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {

            var objToStringify = {acs:[]};

            for(i in rows){
                var sqlDate = rows[i].to_be_conducted_on;

                var ac = {
                    ac_id: rows[i].id,
                    title: rows[i].title,
                    conducted_on: rows[i].to_be_conducted_on,
                    participants_count: rows[i].participants_count,
                    description:rows[i].description,
                    activity_ids:rows[i].activity_ids,
                    activity_types:rows[i].activity_types
                      
                };

                var x = objToStringify.acs.length;
                objToStringify.acs[x] = ac;
            }

            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            var json = JSON.stringify(objToStringify);
            console.log('the Json block sent looks like : ' + json);
            res.end(json);
            
        }});
        connectionTo_AC_MACRO.end();
    }
}
