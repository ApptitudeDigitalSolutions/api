exports.submitForm = function (req, res) {

console.log(req.body);

var name =  req.body.name;
var email = req.body.email;
var phone = req.body.phone;
var message = req.body.message;

var postmark = require("postmark");
      var client = new postmark.Client("7424f227-688f-4979-93ac-e7b35d2de10d");
      var fs = require('fs');
       
      client.sendEmail({
          "From": email, 
          "To": "e.b.campbelton@gmail.com", 
          "Subject": "Enquiry", 
          "TextBody": "Name : " + name + " , Phone : " + phone + " Message : " + message
          
      }, function(error, result) {
          if(error) {
              console.error("Unable to send via postmark: " + error.message);
              return;
          }
          console.info("Sent to postmark for delivery")
      });



}