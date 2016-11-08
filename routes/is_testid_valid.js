exports.validateTestID = function (req, res) {
    var testID = req.params.TEST; 
    console.log("The test ID is " + testID);

    var mysql = require('mysql');
    var connectionTo_TEST_MACRO = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'TEST_MACRO' });
    connectionTo_TEST_MACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});
   
    var async = require('async');
    async.series([function(callback) {
            validateTestID(callback);
    }]);

    function validateTestID(callback){
            // get count of sections
            var query = 'SELECT * FROM Test_templates WHERE id = '+testID+' AND to_be_conducted_on = DATE(NOW());';
            connectionTo_TEST_MACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else {
       
            var testInfoJSON;
            for(i in rows){

                    var test_id = rows[i].id;
                    var test_title = rows[i].test_title;
                    var description = rows[i].description;
                    var test_ids_in_series = rows[i].test_ids_in_series;
                
                    testInfoJSON = {    test_id: test_id,
                                            test_title: test_title,
                                            description: description,
                                            test_ids_in_series: test_ids_in_series};
     
            }

            // were all done creating the payload , itls time send 
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            var json = JSON.stringify(testInfoJSON);
            console.log('TEST INFO is >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + json);
            res.end(json);
            connectionTo_TEST_MACRO.end();

            }});
    }
}
