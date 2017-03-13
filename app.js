var express = require("express");
var bodyParser = require("body-parser");
var fs = require('fs');
var Memcached = require('memcached');
var https = require('https');
var app = express();
var cluster = require('cluster');
var url = require('url');
var bcrypt = require('bcryptjs');
var fse = require('fs-extra');
var cookieParser = require('cookie-parser');
var ip = require('ip');
var numCPUs = require('os').cpus().length;
var request=require('request');
var path = require('path');
var node_ip = ip.address();
var avz = "";
var app = express();


var serverRunning = false;
process.env.TZ = 'UTC';
var date = new Date();


var options = {
		    ca: fs.readFileSync('certificates/gd_bundle-g2-g1.crt', 'utf8'),
		    cert: fs.readFileSync('certificates/fb69616b44c4fa31.crt', 'utf8'),
		    key: fs.readFileSync('certificates/adsapp.pem', 'utf8')
		}



request.get('http://169.254.169.254/latest/meta-data/placement/availability-zone',options,function(err,res,body){
  if(err){

  } //TODO: handle err
  if(res.statusCode == 200 ){
  	console.log("The instance has the following availibility-zone : " + res);
  	avz = res;
  	getNodeConfig(avz);

  } else {
  	console.log("Looks like there was a time out and we are not an ec2 instance");
  	getNodeConfig("di"); // di stands for digital ocean which is where staging is.
  }
});



function getNodeConfig(availibilityZone){

	var configs; 
	fs.readFile('./config.json', 'utf8', function (err, data) {
	  if (err) {
		console.log("Fliq node startup error : File not found");
		throw err;
	  }else{
	  	configs = JSON.parse(data);

	  	 var endpointsstring = configs.staging.endpoints;
	  	 var arrayOfSStagignEndPoints = [];

	  	 if (endpointsstring.indexOf(',') > -1) { 

	  	 	arrayOfSStagignEndPoints = endpointsstring.split(",");

		 }else{

		 	arrayOfSStagignEndPoints.push(configs.staging.endpoints[0]);

		 }
	  	 
	  	 console.log("the endponts are " + arrayOfSStagignEndPoints);
	  	 
	  	//  get the IP for the staging instance
	  	for(i in arrayOfSStagignEndPoints){
	  		
	  		console.log("endpoint : " + arrayOfSStagignEndPoints[i] + " and node IP = " + node_ip);
	  	
	  		// CHECKING FOR STAGING NODE
	  		if(arrayOfSStagignEndPoints[i] == node_ip){
	  			console.log("We are a staging box");
			
			// set environment variables
				app.locals.BOXTYPE = "staging";

				// firebase
	  			app.locals.FIREBASE_SERVER_KEY = configs.staging.firebase[availibilityZone].server_key;
			
				// users db config
	  			app.locals.MACRO_DB_HOST = configs.staging.macro_db[availibilityZone].host;
	  			app.locals.MACRO_DB_USER = configs.staging.macro_db[availibilityZone].user;
	  			app.locals.MACRO_DB_PORT = configs.staging.macro_db[availibilityZone].port;
	  			app.locals.MACRO_DB_PASSWORD = configs.staging.macro_db[availibilityZone].password;
	  			app.locals.MACRO_DB_NAME = configs.staging.macro_db[availibilityZone].database;
	  			app.locals.MACRO_DB_LOCALADDRESS = configs.staging.macro_db[availibilityZone].localAddress;
	  			app.locals.MACRO_DB_SOCKETPATH = configs.staging.macro_db[availibilityZone].socketPath;
	  			app.locals.MACRO_DB_CHARSET = configs.staging.macro_db[availibilityZone].charset;
	  			app.locals.MACRO_DB_TIMEZONE = configs.staging.macro_db[availibilityZone].timezone;
	  			app.locals.MACRO_DB_CONNECTION_TIMEOUT = configs.staging.macro_db[availibilityZone].connectTimeout;
	  			app.locals.MACRO_DB_STRINGIFY_OBJECTS = configs.staging.macro_db[availibilityZone].stringifyObjects;
	  			app.locals.MACRO_DB_INSECURE_AUTH = configs.staging.macro_db[availibilityZone].insecureAuth;
	  			app.locals.MACRO_DB_TYPECAST = configs.staging.macro_db[availibilityZone].typeCast;
	  			app.locals.MACRO_DB_QUERY_FORMAT = configs.staging.macro_db[availibilityZone].queryFormat;
	  			app.locals.MACRO_DB_SUPPORT_BIG_NUMBERS = configs.staging.macro_db[availibilityZone].supportBigNumbers;
	  			app.locals.MACRO_DB_BIG_NUMBER_STRINGS = configs.staging.macro_db[availibilityZone].bigNumberStrings;
	  			app.locals.MACRO_DB_DATA_STRINGS = configs.staging.macro_db[availibilityZone].dateStrings;
	  			app.locals.MACRO_DB_DEBUG = configs.staging.macro_db[availibilityZone].debug;
	  			app.locals.MACRO_DB_TRACE = configs.staging.macro_db[availibilityZone].trace;
	  			app.locals.MACRO_DB_MULTIPLE_STATEMENTS = configs.staging.macro_db[availibilityZone].multipleStatements;
	  			app.locals.MACRO_DB_FLAGS = configs.staging.macro_db[availibilityZone].flags;
	  			app.locals.MACRO_DB_SSL = configs.staging.macro_db[availibilityZone].ssl;


	  			// core db config
	  			app.locals.AC_MACRO_DB_HOST = configs.staging.ac_macro_db[availibilityZone].host;
	  			app.locals.AC_MACRO_DB_USER = configs.staging.ac_macro_db[availibilityZone].user;
	  			app.locals.AC_MACRO_DB_PORT = configs.staging.ac_macro_db[availibilityZone].port;
	  			app.locals.AC_MACRO_DB_PASSWORD = configs.staging.ac_macro_db[availibilityZone].password;
	  			app.locals.AC_MACRO_DB_NAME = configs.staging.ac_macro_db[availibilityZone].database;
	  			app.locals.AC_MACRO_DB_LOCALADDRESS = configs.staging.ac_macro_db[availibilityZone].localAddress;
	  			app.locals.AC_MACRO_DB_SOCKETPATH = configs.staging.ac_macro_db[availibilityZone].socketPath;
	  			app.locals.AC_MACRO_DB_CHARSET = configs.staging.ac_macro_db[availibilityZone].charset;
	  			app.locals.AC_MACRO_DB_TIMEZONE = configs.staging.ac_macro_db[availibilityZone].timezone;
	  			app.locals.AC_MACRO_DB_CONNECTION_TIMEOUT = configs.staging.ac_macro_db[availibilityZone].connectTimeout;
	  			app.locals.AC_MACRO_DB_STRINGIFY_OBJECTS = configs.staging.ac_macro_db[availibilityZone].stringifyObjects;
	  			app.locals.AC_MACRO_DB_INSECURE_AUTH = configs.staging.ac_macro_db[availibilityZone].insecureAuth;
	  			app.locals.AC_MACRO_DB_TYPECAST = configs.staging.ac_macro_db[availibilityZone].typeCast;
	  			app.locals.AC_MACRO_DB_QUERY_FORMAT = configs.staging.ac_macro_db[availibilityZone].queryFormat;
	  			app.locals.AC_MACRO_DB_SUPPORT_BIG_NUMBERS = configs.staging.ac_macro_db[availibilityZone].supportBigNumbers;
	  			app.locals.AC_MACRO_DB_BIG_NUMBER_STRINGS = configs.staging.ac_macro_db[availibilityZone].bigNumberStrings;
	  			app.locals.AC_MACRO_DB_DATA_STRINGS = configs.staging.ac_macro_db[availibilityZone].dateStrings;
	  			app.locals.AC_MACRO_DB_DEBUG = configs.staging.ac_macro_db[availibilityZone].debug;
	  			app.locals.AC_MACRO_DB_TRACE = configs.staging.ac_macro_db[availibilityZone].trace;
	  			app.locals.AC_MACRO_DB_MULTIPLE_STATEMENTS = configs.staging.ac_macro_db[availibilityZone].multipleStatements;
	  			app.locals.AC_MACRO_DB_FLAGS = configs.staging.ac_macro_db[availibilityZone].flags;
	  			app.locals.AC_MACRO_DB_SSL = configs.staging.ac_macro_db[availibilityZone].ssl;



	  			// core db config
	  			app.locals.TEST_MACRO_DB_HOST = configs.staging.test_macro_db[availibilityZone].host;
	  			app.locals.TEST_MACRO_DB_USER = configs.staging.test_macro_db[availibilityZone].user;
	  			app.locals.TEST_MACRO_DB_PORT = configs.staging.test_macro_db[availibilityZone].port;
	  			app.locals.TEST_MACRO_DB_PASSWORD = configs.staging.test_macro_db[availibilityZone].password;
	  			app.locals.TEST_MACRO_DB_NAME = configs.staging.test_macro_db[availibilityZone].database;
	  			app.locals.TEST_MACRO_DB_LOCALADDRESS = configs.staging.test_macro_db[availibilityZone].localAddress;
	  			app.locals.TEST_MACRO_DB_SOCKETPATH = configs.staging.test_macro_db[availibilityZone].socketPath;
	  			app.locals.TEST_MACRO_DB_CHARSET = configs.staging.test_macro_db[availibilityZone].charset;
	  			app.locals.TEST_MACRO_DB_TIMEZONE = configs.staging.test_macro_db[availibilityZone].timezone;
	  			app.locals.TEST_MACRO_DB_CONNECTION_TIMEOUT = configs.staging.test_macro_db[availibilityZone].connectTimeout;
	  			app.locals.TEST_MACRO_DB_STRINGIFY_OBJECTS = configs.staging.test_macro_db[availibilityZone].stringifyObjects;
	  			app.locals.TEST_MACRO_DB_INSECURE_AUTH = configs.staging.test_macro_db[availibilityZone].insecureAuth;
	  			app.locals.TEST_MACRO_DB_TYPECAST = configs.staging.test_macro_db[availibilityZone].typeCast;
	  			app.locals.TEST_MACRO_DB_QUERY_FORMAT = configs.staging.test_macro_db[availibilityZone].queryFormat;
	  			app.locals.TEST_MACRO_DB_SUPPORT_BIG_NUMBERS = configs.staging.test_macro_db[availibilityZone].supportBigNumbers;
	  			app.locals.TEST_MACRO_DB_BIG_NUMBER_STRINGS = configs.staging.test_macro_db[availibilityZone].bigNumberStrings;
	  			app.locals.TEST_MACRO_DB_DATA_STRINGS = configs.staging.test_macro_db[availibilityZone].dateStrings;
	  			app.locals.TEST_MACRO_DB_DEBUG = configs.staging.test_macro_db[availibilityZone].debug;
	  			app.locals.TEST_MACRO_DB_TRACE = configs.staging.test_macro_db[availibilityZone].trace;
	  			app.locals.TEST_MACRO_DB_MULTIPLE_STATEMENTS = configs.staging.test_macro_db[availibilityZone].multipleStatements;
	  			app.locals.TEST_MACRO_DB_FLAGS = configs.staging.test_macro_db[availibilityZone].flags;
	  			app.locals.TEST_MACRO_DB_SSL = configs.staging.test_macro_db[availibilityZone].ssl;

		
	  			console.log(app.locals);
	  			if(!serverRunning){
	  			serverRunning = true;
	  			startServer();
	  			break;
	  			}
	  			
	  		}else{
	  		
	  			
	  		}
	  	}	  	
	
	}	 

 });

}

function startServer(){
	
	
	if (cluster.isMaster) {
	  // Fork workers.
	for (var i = 0; i < numCPUs; i++) {
	cluster.fork();
	}

	cluster.on('exit', function(worker, code, signal) {
	    console.log('worker ' + worker.process.pid + ' died');
	 });
	} else {
	https.createServer(options, app).listen(443); 
		app.use(express.static(path.join(__dirname, '/public'))); 
		app.use(bodyParser.urlencoded({
	        extended: false
	    }));
	    app.use(bodyParser.json());
	    app.use(cookieParser());


		var routes = require(".routes/routes.js")(app);
	}

}





// // if (cluster.isMaster) { 
// // 	var numCPUs = require('os').cpus().length; 
// // 	for (var i = 0; i < numCPUs; i++) { 
// // 		cluster.fork();
// // 	} 
// // cluster.on('exit', function() { cluster.fork(); });
 
// 	app.use(bodyParser.json());
// 	app.use(bodyParser.urlencoded({ extended: true }));
	
// 	var memcached = new Memcached('localhost:11211');
//     Memcached.config.poolSize = 25;
	
// 	app.use(express.static('public'));
//  //    var options = {
// 	// 	   key  : fs.readFileSync('certificates/server.key'),
// 	// 	   cert : fs.readFileSync('certificates/server.crt')
// 	// };
	
//     process.env.TZ = 'UTC';
//     var date = new Date();

//  //    var routes = require("./routes/routes.js")(app);
// 	// https.createServer(options, app).listen(443);

//  var routes = require("./routes/routes.js")(app);
 
// var server = app.listen(8080, function () {
//     console.log("Listening on port %s...", server.address().port);
// });

// //  } else { 
	
// // }