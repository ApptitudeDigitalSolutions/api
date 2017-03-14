// exports.auth = function (req) {
module.exports = {

authenticate: function(username,passcode,req,callback){
	
	var userID = username;
    var passcode = passcode;

    var Memcached = require('memcached');
	var memcached = new Memcached(req.app.locals.MEMCACHE_ENDPOINTS);

    memcached.get(userID, function(err, result) {

        if (err) {
            console.error(err)
        };
        console.dir(result);
        if (result == passcode) {
          console.log('memcache checked and user is present');
          callback(true);
          return true;

        } else {

            if (result == '' || result == undefined) {

                var mysql = require('mysql');
                var connection = mysql.createConnection({
                    host: req.app.locals.MACRO_DB_HOST,
                    user: req.app.locals.MACRO_DB_USER,
                    password: req.app.locals.MACRO_DB_PASSWORD,
                    database: req.app.locals.MACRO_DB_NAME
                });

                connection.connect(function(err) {
                    if (err) {
                        console.error('error connecting: ' + err.stack);
                         callback(false);
                        return false;
                    }
                });


                var query = 'SELECT * FROM Users WHERE username =\'' + username + '\';';
                console.log(query);

                connection.query(query, function(err, rows) {
                    if (err) {
                       console.log(err);
                        callback(false);
                        return false;
                    } else {
                       
                       	console.log(rows);
                        for (var i in rows) {
                        	if(rows[i].passcode == passcode){
        						// this measn the passcode is good 
        						console.log('the passcodes match , we are adding to memcache');
          
        						memcached.set(userID, rows[i].passcode, 300, function(err, result) {
                                	if (err) console.error(err);
                                	console.dir(result);
                            	});
                            	 callback(true);
        						return true;
        					}else{
        						 callback(false);
        						return false;
        					}

                        }

                        if(rows.length == 0){
                        	// no rows were returned aka, there was no passoce for that user
                        	 callback(false);
                        	return false;
                        }

                    }

                });

                connection.end();
            }
        	
        	// if(result != passcode){
        	// 	// this measn the passcode is wrong but is stored in memcache 
        	// 	return false;
        	// }

        }


    });

}

};