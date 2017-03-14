exports.createCompany = function (req, res) {
    var companyname = req.body.companyname;

     var mysql = require('mysql');
     var connectionMACRO = mysql.createConnection({ host: req.app.locals.MACRO_DB_HOST, user: req.app.locals.MACRO_DB_USER, password: req.app.locals.MACRO_DB_PASSWORD, database: req.app.locals.MACRO_DB_NAME});
    connectionMACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var async = require('async');
     async.series([function(callback) {
            createCompanyNow(callback, companyname);
    }]);




     function createCompanyNow(callback) {
            var query = 'INSERT INTO Companies (company_name,create_date, billing_date,plan_type,account_number, account_sort) VALUES (\'' + companyname + '\',NOW(),NOW(),1,1234567889061234,22-22-22);';
            connectionMACRO.query(query, function(err, rows) {if (err) { console.log('Error : The SQL statement is realy batty'); return;} else { 
            console.log("Company successfully created");
            connectionMACRO.end();}});

            res.send(200);
	}


}