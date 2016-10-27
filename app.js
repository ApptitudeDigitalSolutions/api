var express = require("express");
var bodyParser = require("body-parser");
var fs = require('fs');
var Memcached = require('memcached');
var https = require('https');
var app = express();
var cluster = require('cluster');
// var async = require('async');
var url = require('url');
// var bcrypt = require('bcrypt');


// if (cluster.isMaster) { 
// 	var numCPUs = require('os').cpus().length; 
// 	for (var i = 0; i < numCPUs; i++) { 
// 		cluster.fork();
// 	} 
	// cluster.on('exit', function() { cluster.fork(); });
 
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	
	var memcached = new Memcached('localhost:11211');
    Memcached.config.poolSize = 25;

 //    var options = {
	// 	   key  : fs.readFileSync('certificates/server.key'),
	// 	   cert : fs.readFileSync('certificates/server.crt')
	// };
	
    process.env.TZ = 'UTC';
    var date = new Date();

 //    var routes = require("./routes/routes.js")(app);
	// https.createServer(options, app).listen(443);

var routes = require("./routes/routes.js")(app);
 
var server = app.listen(80, function () {
    console.log("Listening on port %s...", server.address().port);
});

//  } else { 
	
// }