exports.submit = function (req, res) {
	console.log("Body be > " + req.body);
	// Require
	var postmark = require("postmark");

	// Example request
	var client = new postmark.Client("7424f227-688f-4979-93ac-e7b35d2de10d");

	client.sendEmail({
	    "From": "elliot.campbelton@apptitudedigitalsolutions.com",
	    "To": "e.b.campbelton@gmail.com",
	    "Subject": "Test", 
	    "TextBody": req.body
	});
}