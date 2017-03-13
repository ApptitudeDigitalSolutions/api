exports.getTime = function (req, res) {
    var username = req.body.username;
    var passcode = req.body.passcode;
    var isValid = 0;

    var mysql = require('mysql');


    var async = require('async');
    async.series([function(callback) {
            getTimeFunction(callback);
    }]);

    function getTimeFunction(callback) {
                                        // perform getTime 
                                        var currentTime = Math.round(new Date().getTime() / 1000.0);
						                var stringTimeConvert = parseInt(currentTime);
						                res.writeHead(200, {
						                    "Content-Type": "application/json"
						                });
						                var json = JSON.stringify({
						                    time: stringTimeConvert
						                });
						                res.end(json);
                                        
    }
}
