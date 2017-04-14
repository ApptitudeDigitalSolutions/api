var fs = require('fs');
var    savePath = '/home/ubuntu/api/reports/results.xlsx';
var officegen = require('officegen');

var xlsx = officegen ( 'xlsx' );

xlsx.on ( 'finalize', function ( written ) {
		console.log ( 'Finish to create an Excel file.\nTotal bytes created: ' + written + '\n' );

		var postmark = require("postmark");
        var client = new postmark.Client("7424f227-688f-4979-93ac-e7b35d2de10d");
         var x =  fs.readFileSync(savePath).toString('base64');

        fs.readFile(savePath, (err, data) => {
		  if (err) throw err;
		  console.log(data);
		  var fc = data.toString('base64');

		  client.sendEmail({
            "From": "elliotcampbelton@apptitudedigitalsolutions.com", 
            "To": "e.b.campbelton@gmail.com", 
            "Subject": "Test", 
            "TextBody": "Test Message",
            "Attachments": [{
              // Reading synchronously here to condense code snippet: 
              "Content": fc,
              "Name": 'results.xlsx',
              "ContentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }]
        }, function(error, result) {
            if(error) {
                console.error("Unable to send via postmark: " + error.message);
                return;
            }
            console.info("Sent to postmark for delivery")
        });
        

		});



		});

xlsx.on ( 'error', function ( err ) {
			console.log ( err );
		});

sheet = xlsx.makeNewSheet ();
sheet.name = 'Excel Test';

// The direct option - two-dimensional array:
sheet.data[0] = [];
sheet.data[0][0] = 1;
sheet.data[1] = [];
sheet.data[1][3] = 'abc';
sheet.data[1][4] = 'More';
sheet.data[1][5] = 'Text';
sheet.data[1][6] = 'Here';
sheet.data[2] = [];
sheet.data[2][5] = 'abc';
sheet.data[2][6] = 900;
sheet.data[6] = [];
sheet.data[6][2] = 1972;

// Using setCell:
sheet.setCell ( 'E7', 340 );
sheet.setCell ( 'I1', -3 );
sheet.setCell ( 'I2', 31.12 );
sheet.setCell ( 'G102', 'Hello World!' );

var out = fs.createWriteStream ( savePath);

out.on ( 'error', function ( err ) {
	console.log ( err );
});

xlsx.generate ( out );