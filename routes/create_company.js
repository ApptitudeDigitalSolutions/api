exports.createCompany = function (req, res) {
    var companyname = req.body.companyname;

     var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});


     async.series([function(callback) {
            createCompanyNow(callback, companyname);
    }]);




     function createCompanyNow(callback,companyname) {
            var query = 'INSERT INTO Companies (company_name,create_date, billing_date,plan_type,account_number, account_sort) VALUES (\'' + companyname + '\',NOW(),NOW(),1,1234567889061234,22-22-22);';
            connection.query(query, function(err, rows) {if (err) { console.log('Error : The SQL statement is realy batty'); return;} else { 
            console.log("Company successfully created");
            connection.end();}});

            res.send(200);
	}


}