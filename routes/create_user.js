exports.createUser = function (req, res) {
    var companyname = req.body.companyname;
    var username = req.body.username;
    var password = req.body.password;
    var first = req.body.first;
    var last = req.body.last;
    var number = req.body.number;
    var role = req.body.role;

    console.log("HI");

    function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
    }


    var mysql = require('mysql');
     var connectionMACRO = mysql.createConnection({ host: req.app.locals.MACRO_DB_HOST, user: req.app.locals.MACRO_DB_USER, password: req.app.locals.MACRO_DB_PASSWORD, database: req.app.locals.MACRO_DB_NAME});
    connectionMACRO.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var async = require('async');
     async.series([function(callback) {
            createUserNow(callback);
    }]);

     function createUserNow(callback) {

        var query = 'SELECT id FROM Companies WHERE company_name =\'' + companyname + '\';';
        connectionMACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else { 
        console.log("Company successfully created");
                var companyID = rows[0].id;

                // hash that passowrd
                var bcrypt = require('bcrypt');
                bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    // Store hash in your password DB. 
                    //console.log('the has is : ' + hash);

                    password = hash;
                // genrerate that passcode 
                var passcode = randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                
                var query = 'INSERT INTO Users (company_id,username,password,passcode,phone_number,role,first,last) VALUES (\'' + companyID + '\',\'' + username + '\',\'' + password + '\',\'' + passcode + '\',\'' + number + '\',\'' + role + '\',\'' + first + '\',\'' + last + '\');';
                connectionMACRO.query(query, function(err, rows) {if (err) { console.log('Error SQL :' + err); return;} else { 
                console.log("User successfully created");
                connectionMACRO.end();
                }});
            });

        });

        }});


            res.send(200);
	}


}