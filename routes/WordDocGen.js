module.exports = {

generate: function(info,ACID){

var async = require ( 'async' );
var officegen = require('officegen');
var fs = require('fs');
var path = require('path');



ensureExists('/home/ubuntu/api/reports/'+ACID, 0744, function(err) {
    if (err){
    	console.log(err);
    } // handle folder creation error
});


var themeXml = fs.readFileSync ( path.resolve ( __dirname, 'testTheme.xml' ), 'utf8' );

var docx = officegen ( {

	type: 'docx',
	orientation: 'landscape'

} );

			
console.log(info);

docx.on ( 'error', function ( err ) {
			console.log ( err );
		});

var d = new Date();
var n = d.getTime();

var fileNameString = info.candidate_name + "_" + info.assessor_name + "_" + n + ".docx";
var fileNameString = fileNameString.replace(" ", "_");
console.log("The filename will be > "+ fileNameString);

// page 1 (Intro)
var pObj = docx.createP ();
pObj.addImage ( path.resolve(__dirname, '/home/ubuntu/api/report_generation_assets/logo_croped.png' ) );
pObj.addLineBreak ();
pObj.addLineBreak ();

var pObj = docx.createP ();
pObj.addText ( info.title, { font_face: 'Helvetica', font_size: 35 } );
pObj.addLineBreak ();
pObj.addLineBreak ();
pObj.addText ( 'Candidate Name :'+info.candidate_name, { font_face: 'Arial', font_size: 20 });
pObj.addLineBreak ();
pObj.addText ( 'Assessors Name(s) :'+info.assessor_name, { font_face: 'Arial', font_size: 20 });
pObj.addLineBreak ();
pObj.addText ( 'Date :'+info.date, { font_face: 'Arial', font_size: 20 });
pObj.addLineBreak ();pObj.addLineBreak ();
docx.putPageBreak ();

// Other pages
for(i in info.activities){
	// every activity gets processed in here 
	var pObj = docx.createP ();
	if(info.activities[i].acticity_type == "i"){
		pObj.addText ( "Interview assessment", { font_face: 'Arial', font_size: 20 });
	}
	
	if(info.activities[i].acticity_type == "p"){
		pObj.addText ( "Presentation assessment", { font_face: 'Arial', font_size: 20 });
	}
	
	if(info.activities[i].acticity_type == "rp"){
		pObj.addText ( "Roleplay assessment", { font_face: 'Arial', font_size: 20 });
	}

	pObj.addLineBreak ();
	pObj.addLineBreak ();
	
	pObj.addText (info.activities[i].activity_report_intro);
	
	// add in any table if there is one to add
	if(info.activities[i].activity_report_intro_table.length > 0){
		// insert table
		var table=[[]];

		console.log("The tbale looks like : " + table);
		
		var tableStyle = {
			tableColWidth: 8000,
			tableSize: 24,
			tableBorder:1,
			tableColor: "ada",
			tableAlign: "left",
			tableFontFamily: "Arial",
			borders: true
		}

		// create table rows
		for(j in info.activities[i].activity_report_intro_table){
			// split string down 
			if(table[0].length == 0){
				console.log('this means its the first row');

				// split sring 
				var arrayOfColumns = info.activities[i].activity_report_intro_table[j].cells.split("|");
				console.log(arrayOfColumns);

				for(k in arrayOfColumns){
					var columnObject = {
										val: arrayOfColumns[k],
										opts: {
											cellColWidth: 4261,
											b:true,
											sz: '22',
											fontFamily: "Arial",
											shd: {
								                fill: "92CDDC",
								               
								                "themeFillTint": "80"
								            }
										}
									};
					table[0][k] = columnObject;
				}
				//console.log(table);

			}	else{
				console.log('this means it is another row');
				var arrayOfColumns = info.activities[i].activity_report_intro_table[j].cells.split("|");
				console.log(arrayOfColumns);

				var cellsRow = [];
				for(k in arrayOfColumns){
					cellsRow.push(arrayOfColumns[k]);
				}
				table.push(cellsRow);
				console.log(table);
			}
		}
		var pObj = docx.createTable (table, tableStyle);
	}	

	docx.putPageBreak ();

	// ok lets fill in the Overview section
	if(info.activities[i].activity_performace_overview_table.length > 0){
		// insert table
		var table=[[]];

		console.log("The tbale looks like : " + table);
		
		var tableStyle = {
			tableColWidth: 8000,
			tableSize: 24,
			tableBorder:1,
			tableColor: "ada",
			tableAlign: "left",
			tableFontFamily: "Arial",
			borders: true
		}

		// create table rows
		for(j in info.activities[i].activity_performace_overview_table){
			// split string down 
			if(table[0].length == 0){
				console.log('this means its the first row');

				// split sring 
				var arrayOfColumns = info.activities[i].activity_performace_overview_table[j].cells.split("|");
				console.log(arrayOfColumns);

				for(k in arrayOfColumns){
					var columnObject = {
										val: arrayOfColumns[k],
										opts: {
											cellColWidth: 4261,
											b:true,
											sz: '22',
											fontFamily: "Arial",
											shd: {
								                fill: "92CDDC",
								               
								                "themeFillTint": "80"
								            }
										}
									};
					table[0][k] = columnObject;
				}
				//console.log(table);

			}else{
				console.log('this means it is another row');
				var arrayOfColumns = info.activities[i].activity_performace_overview_table[j].cells.split("|");
				console.log(arrayOfColumns);

				var cellsRow = [];
				if(arrayOfColumns.length > 1){
					for(k in arrayOfColumns){
						cellsRow.push(arrayOfColumns[k]);
					}
				}else{
					// this means the row is a single one 
					cellsRow.push({val: arrayOfColumns[0], opts: {gridSpan: 2}});
				}

				table.push(cellsRow);
				console.log(table);

			}


		}
		var pObj = docx.createTable (table, tableStyle);
	}


	docx.putPageBreak ();	


	if(info.activities[i].activity_report_components.length > 0){
		console.log("THE LENGTH IS : " +info.activities[i].activity_report_components.length);
		
		 for(zk in info.activities[i].activity_report_components){
		
		
			console.log("we are in here>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
		
			console.log(info.activities[i].activity_report_components[zk].title);
			
			var pObj = docx.createP ();
			pObj.addText (info.activities[i].activity_report_components[zk].title, { font_face: 'Arial', font_size: 17 });
		
			pObj.addLineBreak ();
			// insert table
			

			console.log("The tbale looks like : " + table);
			
			var tableStyle = {
				
				tableSize: 24,
				tableBorder:1,
				tableColor: "ada",
				tableAlign: "left",
				tableFontFamily: "Arial",
				borders: true
			}

			var table=[[]];
		
			for(j in info.activities[i].activity_report_components[zk].table){
				// split string down 
				if(table[0].length == 0){
					console.log('this means its the first row AND THE VALUE OF zk = ' +zk +' and J = ' + j);

					// split sring 
					console.log(JSON.stringify(info.activities[i].activity_report_components[zk].table[j].cells));
					var str = info.activities[i].activity_report_components[zk].table[j].cells;
					var arrayOfColumns = str.split("|");
					console.log(arrayOfColumns);

					for(k in arrayOfColumns){
						var columnObject = {
											val: arrayOfColumns[k],
											opts: {
												cellColWidth: 4261,
												b:true,
												sz: '22',
												fontFamily: "Arial",
												shd: {
									                fill: "92CDDC",
									               
									                "themeFillTint": "80"
									            }
											}
										};
						table[0][k] = columnObject;
					}
					//console.log(table);

				}else{
					console.log('this means it is another row');
					var str = info.activities[i].activity_report_components[zk].table[j].cells;
					var arrayOfColumns = str.split("|");
					console.log(arrayOfColumns);

					var cellsRow = [];
					if(arrayOfColumns.length > 1){
						for(k in arrayOfColumns){
							cellsRow.push(arrayOfColumns[k]);
						}
					}else{
						// this means the row is a single one 
						cellsRow.push({val: arrayOfColumns[0], opts: {gridSpan: table[0].length}});
					}

					table.push(cellsRow);
					console.log(table);

				}


			}

			var pObj = docx.createTable (table, tableStyle);
			docx.putPageBreak ();
		}

	}




}

var success =true;
console.log("SAVE PATH  = " + '/home/ubuntu/api/reports/'+ ACID +'/'+fileNameString);
var savePath = '/home/ubuntu/api/reports/'+ ACID +'/'+fileNameString;
var out = fs.createWriteStream ( '/home/ubuntu/api/reports/'+ ACID +'/'+fileNameString);
// wirite file handle in db 

out.on ( 'error', function ( err ) {
	console.log ( err );
});

async.parallel ([
	function ( done ) {
		out.on ( 'close', function () {
			console.log ( 'Finish to create a DOCX file.' );

			var postmark = require("postmark");
			var client = new postmark.Client("7424f227-688f-4979-93ac-e7b35d2de10d");
			var fs = require('fs');
			 
			client.sendEmail({
			    "From": "elliotcampbelton@apptitudedigitalsolutions.com", 
			    "To": "e.b.campbelton@gmail.com", 
			    "Subject": "Test", 
			    "TextBody": "Test Message",
			    "Attachments": [{
			      // Reading synchronously here to condense code snippet: 
			      "Content": fs.readFileSync(savePath).toString('base64'),
			      "Name": fileNameString,
			      "ContentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			    }]
			}, function(error, result) {
			    if(error) {
			        console.error("Unable to send via postmark: " + error.message);
			        return;
			    }
			    console.info("Sent to postmark for delivery")
			});

			done ( null );
		});
		docx.generate ( out );
	}

], function ( err ) {
	if ( err ) {

		console.log ( 'error: ' + err );
		success =false;
	} // Endif.
});




function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 0777;
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
}

return success;
}

};
