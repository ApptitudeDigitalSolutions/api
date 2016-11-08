exports.createAC = function (req, res) {
    var company_id = req.body.company_id;
    var title = req.body.title;
    var description = eq.body.description;

     var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'AC_MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var async = require('async');
     async.series([function(callback) {
            createCompanyNow(callback, companyname);
    }]);

     function createCompanyNow(callback) {
            var query = 'INSERT INTO Assessment_Center_templates (company_id,created_on, participants_count,title,description,to_be_conducted_on, activity_ids,activity_types) VALUES (\'' + company_id + '\',NOW(),0,\'' + title + '\',\'' + description + '\',NOW(),\'\',\'\');';
            connection.query(query, function(err, rows) {if (err) { console.log('Error : The SQL statement is realy batty'); return;} else { 
            console.log("Company successfully created");

            var query1 = "CREATE TABLE `Assessment_Center_candidates_"+company_id+"` (  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,  `First` text,  `Last` text,  `Email` text,  `Role` text,  `Other` text,  `created_on` datetime DEFAULT NULL,  `set_activities` text,  `completed_activities` text,  PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;";
            connection.query(query1, function(err, rows) {if (err) { console.log('Error : The SQL statement is realy batty'); return;} else { 
            console.log("Company successfully created");
            }});

            connection.end();}});

            res.send(200);
	}


}