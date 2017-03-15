module.exports = {

generate: function(info){

var async = require ( 'async' );
var officegen = require('officegen');
var fs = require('fs');
var path = require('path');

var themeXml = fs.readFileSync ( path.resolve ( __dirname, 'testTheme.xml' ), 'utf8' );

var docx = officegen ( {

	type: 'docx',
	orientation: 'landscape'

} );

			
console.log(info);

docx.on ( 'error', function ( err ) {
			console.log ( err );
		});


// page 1 (Intro)
var pObj = docx.createP ();
pObj.addImage ( path.resolve(__dirname, 'images_for_examples/logo_croped.png' ) );
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
					console.log('this means its the first row');

					// split sring 
					var arrayOfColumns = info.activities[i].activity_report_components[zk].table[j].cells.split("|");
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
					var arrayOfColumns = info.activities[i].activity_report_components[zk].table[j].cells.split("|");
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
var out = fs.createWriteStream ( 'tmp/out.docx' );
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
			    "From": "donotreply@example.com", 
			    "To": "e.b.campbelton@gmail.com", 
			    "Subject": "Test", 
			    "TextBody": "Test Message",
			    "Attachments": [{
			      // Reading synchronously here to condense code snippet: 
			      "Content": fs.readFileSync("tmp/out.docx").toString('base64'),
			      "Name": "out.docx",
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

return success;
}

};
