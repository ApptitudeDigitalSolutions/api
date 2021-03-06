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


// var info = {title:"Westminster AC",candidate_name:"Roger Federer",assessor_name:"admin",date:"07/11/2017",activities:[{acticity_type:"i",activity_report_intro:"Apptitude Digital Solutions ? Competency Based Interview\n\nIntroduction \n\nDuration ? 30 minutes\n\n- Have you ever completed a CBI before?\n\n- Received candidate information pack? (e.g. STAR technique, competencies etc?)\n\n- 5 competencies ? Customer Service, Planning &amp; Organising, Problem Solving, Collaboration and Communication\n\n- 4 competency questions ? Communication observed during the interview\n\n- Fine to use notes to refer to, just don?t read from them\n\n- The interview will all be audio recorded for scoring purposes and then deleted\n\n- Timed throughout - we may have to move on so equal time is spent on each competency\n\n- Any questions?",activity_report_intro_table:[],activity_performace_overview_table:[],activity_report_components:[{title:"Collaboration\rCooperating, collaborating and partnering with others.",table:[{cells:"Catergory|Answer"},{cells:"Negative|Does just enough so that the customer leaves with their needs met"},{cells:"Positive|Is proactive in identifying specific customer requirements clarifies customer needs"},{cells:"Positive|Seeks feedback from customers and adapts responses/actions accordingly"},{cells:"Negative|Shows frustration, impatience and/or lack of professionalism when dealing with a demanding customer issue"},{cells:"Negative|Shows frustration, impatience and/or lack of professionalism when dealing with a demanding customer issue"},{cells:"Positive|Is proactive in identifying specific customer requirements clarifies customer needs"},{cells:"Positive|Prioritises the customer whilst effectively managing other role/business demands"},{cells:"Negative|Shows frustration, impatience and/or lack of professionalism when dealing with a demanding customer issue"},{cells:"Negative|Does just enough so that the customer leaves with their needs met"},{cells:"Positive|Seeks feedback from customers and adapts responses/actions accordingly"},{cells:"Positive|Seeks feedback from customers and adapts responses/actions accordingly"},{cells:"Positive|Prioritises the customer whilst effectively managing other role/business demands"},{cells:"Positive|Is proactive in identifying specific customer requirements clarifies customer needs"},{cells:"Negative|Does just enough so that the customer leaves with their needs met"},{cells:"Positive|Seeks feedback from customers and adapts responses/actions accordingly"},{cells:"Positive|Is proactive in identifying specific customer requirements clarifies customer needs"},{cells:"Negative|Shows frustration, impatience and/or lack of professionalism when dealing with a demanding customer issue"},{cells:"Negative|Does just enough so that the customer leaves with their needs met"},{cells:"Positive|Prioritises the customer whilst effectively managing other role/business demands"},{cells:"Negative|Does just enough so that the customer leaves with their needs met"},{cells:"Positive|Prioritises the customer whilst effectively managing other role/business demands"},{cells:"Positive|Prioritises the customer whilst effectively managing other role/business demands"},{cells:"Positive|Prioritises the customer whilst effectively managing other role/business demands"},{cells:"Negative|Disregards obstacles/delays addressing problems which impact on planned project delivery"},{cells:"Positive|Adopts a clear, logical approach to planning project delivery"},{cells:"Negative|Disregards obstacles/delays addressing problems which impact on planned project delivery"},{cells:"Negative|Maintains the same approach/work scope throughout regardless"},{cells:"Negative|Maintains the same approach/work scope throughout regardless"},{cells:"Positive|Effectively tackles obstacles to keep the project/piece of work on track"},{cells:"Positive|Divides the project/piece of work into sizeable chunks and allocates timescales"},{cells:"Negative|Disregards obstacles/delays addressing problems which impact on planned project delivery"},{cells:"Positive|Adopts a clear, logical approach to planning project delivery"},{cells:"Negative|Maintains the same approach/work scope throughout regardless"},{cells:"Negative|Struggles to identify the cost and benefit of any compromises"},{cells:"Positive|Adopts a clear, logical approach to planning project delivery"},{cells:"Positive|Divides the project/piece of work into sizeable chunks and allocates timescales"},{cells:"Positive|Effectively tackles obstacles to keep the project/piece of work on track"},{cells:"Negative|Struggles to identify the cost and benefit of any compromises"},{cells:"Positive|Divides the project/piece of work into sizeable chunks and allocates timescales"},{cells:"Negative|Disregards obstacles/delays addressing problems which impact on planned project delivery"},{cells:"Negative|Struggles to identify the cost and benefit of any compromises"},{cells:"Positive|Divides the project/piece of work into sizeable chunks and allocates timescales"},{cells:"Positive|Effectively tackles obstacles to keep the project/piece of work on track"},{cells:"Positive|Adopts a clear, logical approach to planning project delivery"},{cells:"Negative|Maintains the same approach/work scope throughout regardless"},{cells:"Negative|Struggles to identify the cost and benefit of any compromises"},{cells:"Positive|Effectively tackles obstacles to keep the project/piece of work on track"},{cells:"Positive|Effectively tackles obstacles to keep the project/piece of work on track"},{cells:"Positive|Generates and implements new, innovative solutions as preventive measures to obstacles"},{cells:"Positive|Identifies and seeks input from available sources to support and enable delivery"},{cells:"Positive|Articulates the pros & cons of various options considered and offers sound rationale for chosen solutions"},{cells:"Negative|No account taken of the need to factor in contingencies"},{cells:"Positive|Articulates the pros & cons of various options considered and offers sound rationale for chosen solutions"},{cells:"Positive|Generates and implements new, innovative solutions as preventive measures to obstacles"},{cells:"Positive|Foresees potential obstacles and takes ownership for addressing these"},{cells:"Positive|Identifies and seeks input from available sources to support and enable delivery"},{cells:"Positive|Generates and implements new, innovative solutions as preventive measures to obstacles"},{cells:"Positive|Articulates the pros & cons of various options considered and offers sound rationale for chosen solutions"},{cells:"Positive|Foresees potential obstacles and takes ownership for addressing these"},{cells:"Positive|Identifies and seeks input from available sources to support and enable delivery"},{cells:"Positive|Foresees potential obstacles and takes ownership for addressing these"},{cells:"Negative|No account taken of the need to factor in contingencies"},{cells:"Positive|Identifies and seeks input from available sources to support and enable delivery"},{cells:"Negative|No account taken of the need to factor in contingencies"},{cells:"Positive|Foresees potential obstacles and takes ownership for addressing these"},{cells:"Positive|Generates and implements new, innovative solutions as preventive measures to obstacles"},{cells:"Negative|No account taken of the need to factor in contingencies"},{cells:"Positive|Articulates the pros & cons of various options considered and offers sound rationale for chosen solutions"},{cells:"Negative|No account taken of the need to factor in contingencies"},{cells:"Positive|Adapts approach for the greater good of the team"},{cells:"Positive|Adapts approach for the greater good of the team"},{cells:"Negative|Lacks the wider view is dismissive of others viewpoint follows own agenda"},{cells:"Negative|Offers little acknowledgement or is dismissive of what others contribute"},{cells:"Positive|Links a co-operative, supportive culture with high-performing teams"},{cells:"Positive|Links a co-operative, supportive culture with high-performing teams"},{cells:"Negative|Lacks the wider view is dismissive of others viewpoint follows own agenda"},{cells:"Positive|Links a co-operative, supportive culture with high-performing teams"},{cells:"Negative|Offers little acknowledgement or is dismissive of what others contribute"},{cells:"Negative|Lacks the wider view is dismissive of others viewpoint follows own agenda"},{cells:"Negative|Offers little acknowledgement or is dismissive of what others contribute"},{cells:"Positive|Adapts approach for the greater good of the team"},{cells:"Negative|Offers little acknowledgement or is dismissive of what others contribute"},{cells:"Negative|Lacks the wider view is dismissive of others viewpoint follows own agenda"},{cells:"Positive|Adapts approach for the greater good of the team"},{cells:"Positive|Adapts approach for the greater good of the team"},{cells:"Negative|Offers little acknowledgement or is dismissive of what others contribute"},{cells:"Positive|Links a co-operative, supportive culture with high-performing teams"},{cells:"Positive|Links a co-operative, supportive culture with high-performing teams"},{cells:"Negative|Delivers messages in a monotone voice with little enthusiasm"},{cells:"Positive|Speaks confidently, assertively and fluently throughout the interview"},{cells:"Positive|Responses to the questions are concise and precise"},{cells:"Negative|Delivers messages in a monotone voice with little enthusiasm"},{cells:"Positive|Responses to the questions are concise and precise"},{cells:"Positive|Responses to the questions are concise and precise"},{cells:"Negative|Delivers messages in a monotone voice with little enthusiasm"},{cells:"Negative|Responses are too lengthy and require continuous refocusing to answer the question asked"},{cells:"Positive|Speaks confidently, assertively and fluently throughout the interview"},{cells:"Positive|Responses to the questions are concise and precise"},{cells:"Negative|Delivers messages in a monotone voice with little enthusiasm"},{cells:"Negative|Responses are too lengthy and require continuous refocusing to answer the question asked"},{cells:"Positive|Speaks confidently, assertively and fluently throughout the interview"},{cells:"Positive|Speaks confidently, assertively and fluently throughout the interview"},{cells:"Negative|Responses are too lengthy and require continuous refocusing to answer the question asked"},{cells:"Negative|Responses are too lengthy and require continuous refocusing to answer the question asked"},{cells:"Negative|Delivers messages in a monotone voice with little enthusiasm"},{cells:"Negative|Responses are too lengthy and require continuous refocusing to answer the question asked"},{cells:"Positive|Speaks confidently, assertively and fluently throughout the interview"},{cells:"Negative|Responses are too lengthy and require continuous refocusing to answer the question asked"},{cells:"Negative|Responses are too lengthy and require continuous refocusing to answer the question asked"}]}]},{"acticity_type":"p","activity_report_intro":"Page 1\nBackground\n\nYou?ve recently joined the North London University?s (NLU) Marketing team. Your manager has asked you to attend a team meeting to develop and collectively discuss a new social media campaign for the school of Arts at the North London University (NLU).\n\nFollowing the meeting, you will be asked to deliver your recommendations and strategy to Jo Smith, the Dean of the School of Arts, in the form of a 5-minute individual presentation.\n\nYour task\n\nFirstly, you have been given 30 minutes to read this Candidate Brief in silence and prepare yourself for a group discussion, during which you are encouraged to share your own ideas, listen to others and seek collective agreement on critical decisions. Your task then is to discuss and come to an agreement as to what the new social media campaign for the school of Arts at the North London University will involve. Following the group discussion time of 20 minutes, you will have further 10 minutes to formalise your individual presentation to Jo Smith, who is responsible for approving new initiatives at the School of Arts. To convince Jo Smith of your proposed ideas, you will be expected to outline your proposal and the rationale behind this.\n\nAs part of your individual 5-minute presentation you also need to include detail on the following:\n- Analysis of competing universities in the market\n- How and when your strategy will be implemented\nAt the end of the individual presentation time, further 5 minutes have been allocated for Questions / Answers.\n\nTimings\n\nIndividual group preparation time: 30 minutes\nGroup discussion time: 20 minutes\nPresentation preparation time: 10 minutes\nIndividual presentation: 5 minutes\nQuestion &amp; Answer session: 5 minutes\n\nCompetencies\nYour performance in this exercise will be measured against the following competencies:\n- Planning Organising - Planning and organising demanding projects to deliver objectives on time and to the highest standard.\n- Problem Solving - Generating innovative, valuable ideas and effective solutions to problems.\n- Communication - Communicating clearly in a way that engages the audience and helps them understand and retain the message. Listening effectively to, negotiating with and influencing others.\n- Collaboration - Cooperating, collaborating and partnering with others.\n\nResources\n\nYou have been provided with:\n- Group Exercise &amp; Presentation Candidate Brief\n- Rough paper\n- 2 pens\n- Flipchart paper\n- Flipchart pens\n\nDo you have any questions? \nYour 30-minute individual group preparation time starts now.\n\n\nPage 2 - Background information\n\nBackground notes\n- Your name is Jo Smith\n- Your role is Dean of the school of Arts\n\nQ/A questions following individual presentation\n\n- Why did you focus on ______ out of the various social media channels available?\n- What Unique Selling Point (USP) would you focus on?\n- Which competing university poses the greatest threat to NLU? Why?\n- Would you / why did you target this market? (e.g. East Asia, China etc...)\n- How would you roll out your strategy to the School of Arts? (Involve the faculty?)\n- What issues do you anticipate when implementing your strategy? How will you overcome these?\n- What impact will your new strategy have on the School of Arts?\n\n\nCompetencies measured\n- Planning Organising\n- Problem Solving\n- Communication\n- Collaboration (Group Exercise only)","activity_report_intro_table":[],"activity_performace_overview_table":[],"activity_report_components":[{"title":"Communication \rCommunicating clearly in a way that engages the audience and helps them understand and retain the message.  Listening effectively to, negotiating with and influencing others.","table":[{cells:"Catergory|Answer"},{cells:"Positive|Divides the campaign into sizeable chunks and allocates timescales"},{cells:"Negative|Maintains the same approach/work scope throughout regardless"},{cells:"Commnet|trv"},{cells:"Score|5"},{cells:"Positive|Articulates the pros & cons of various options considered and offers sound rationale for chosen solutions"},{cells:"Positive|Proposes new, innovative solutions as preventive measures to obstacles"},{cells:"Score|671"},{cells:"Commnet|jrf"},{cells:"Negative|Does not anticipate potential barriers to campaign delivery"},{cells:"Positive|Speaks confidently, assertively and fluently throughout"},{cells:"Positive|Presents a positive and professional self-image, (e.g. uses language appropriate to the audience, is articulate)"},{cells:"Positive|Consistently demonstrates clear and structured communication style; presents information in a logical manner"},{cells:"Score|4884"},{cells:"Commnet|rfrv"},{cells:"Score|47"},{cells:"Commnet|dvjimivrmirv"},{cells:"Negative|Offers little acknowledgement or is dismissive of what others contribute"},{cells:"Negative|Lacks the wider view; is dismissive of others viewpoints; follows own agenda"},{cells:"Negative|Keeps things to themselves, misses opportunities to share learning and best practice"},{cells:"Positive|Shares own learning and best practice, encouraging others to follow lead"}]}]}]};
// var info = {title:"Welcome to this test AC",
// 			candidate_name: "John Doe",
// 			assessor_name: "Michael Blakley",
// 			date: "12/12/2016",
			
// 			activities:[
// 			{
// 				acticity_type:"rp",
// 				activity_report_intro:"RolePlay Intro text : Once you have observed the external simulation exercise by the candidate, review your evidence carefully and use the evaluation boxes to rate the candidate?s performance against the described criteria. - Each competency has an evaluation form which is used for evaluating the candidates performance - Within each evaluation form are a number of behavioural indicators - Your task is to refer to your notes and mark each behavioural indicator on the five-point scale - You then need to provide an overall rating for each of the behavioural areas which reflects the spread of scores across the indicators. Assign whole numbers only. Use the rating scale here to help you do this - Following this, you should then complete a number of evidence statements to support the rating you have given. This will help you provide feedback to the candidate and in the report writing.",
// 				activity_report_intro_table:[{cells:"Rating|Definition"},
// 											 {cells:"5|Excellent - marked strengths on most aspects of the competency."},
// 											 {cells:"4|Good - marked strengths on some aspects of the competency and acceptable on others."},
// 											 {cells:"3|Satisfactory - acceptable across the competency as a whole with some minor weaknesses. Some development required."},
// 											 {cells:"2|Marginal - strong weaknesses across some of the competency areas. Development required."},
// 											 {cells:"1|Poor - strong weaknesses across most of the competency. Significant development required."}],
// 				activity_performace_overview_table:[{cells:"Behaviour|Overall rating"},
// 													{cells:"Takes Ownership|4"},
// 													{cells:"Works Collaboratively|4"},
// 													{cells:"Leads &amp Engages|4"},
// 													{cells:"Overall Performance in Exercise The candidate adopted a very collaborative, engaging and supportive approach. Immediately able to build rapport with The role player and insightful line of questioning used to try and get to root cause of any issues and to build engagement with The role player. The candidate was able to be put steps in place to try and develop an effective relationship with The role player and built on The role player’s ideas to try and motivate him."},
// 													],
// 					activity_report_components:[
// 												{
// 													title:"Takes Ownership - Insert description of competency here",
// 													table:[
// 														{cells:"Negative Behaviours|1|2|3|4|5|Positive Behaviours"},
// 														{cells:"Gives limited thought to planning|||X|||Explores and identifies"},
// 														{cells:"Fails to engage with the role player||||X||Effectively persuades role player"},
// 														{cells:"Aviods risk|||X|||Explores risks with the role player"},
// 														{cells:"Poor questioning approach|||X|||Effective questioning approach"},
// 														{cells:"The candidate used an incredibly insightful questioning style to identify the underlying issues and framed these issues in a very positive manner. He was able to demonstrate an engaging and persuasive style and tried to inspire The role player when discussing what could be done more effectively. The candidate needs to explore the risks attached to The role player’s plan and consider the resources required to make it successful when implementing it. The candidate offered a lot of praise and tried to ensure that The role player felt like a valued member of the team. Some evidence provided of an adaptable communication style, but more assertion around the communication issue with Other staff members would have been beneficial."},
// 														{cells:"4"}
// 													]
// 												},
// 												{
// 													title:"Takes Ownership - Insert description of competency here",
// 													table:[
// 														{cells:"Negative Behaviours|1|2|3|4|5|Positive Behaviours"},
// 														{cells:"Gives limited thought to planning|||X|||Explores and identifies"},
// 														{cells:"Fails to engage with the role player||||X||Effectively persuades role player"},
// 														{cells:"Aviods risk|||X|||Explores risks with the role player"},
// 														{cells:"Poor questioning approach|||X|||Effective questioning approach"},
// 														{cells:"The candidate used an incredibly insightful questioning style to identify the underlying issues and framed these issues in a very positive manner. He was able to demonstrate an engaging and persuasive style and tried to inspire The role player when discussing what could be done more effectively. The candidate needs to explore the risks attached to The role player’s plan and consider the resources required to make it successful when implementing it. The candidate offered a lot of praise and tried to ensure that The role player felt like a valued member of the team. Some evidence provided of an adaptable communication style, but more assertion around the communication issue with Other staff members would have been beneficial."},
// 														{cells:"4"}
// 													]
// 												},
// 												{
// 													title:"Takes Ownership - Insert description of competency here",
// 													table:[
// 														{cells:"Negative Behaviours|1|2|3|4|5|Positive Behaviours"},
// 														{cells:"Gives limited thought to planning|||X|||Explores and identifies"},
// 														{cells:"Fails to engage with the role player||||X||Effectively persuades role player"},
// 														{cells:"Aviods risk|||X|||Explores risks with the role player"},
// 														{cells:"Poor questioning approach|||X|||Effective questioning approach"},
// 														{cells:"The candidate used an incredibly insightful questioning style to identify the underlying issues and framed these issues in a very positive manner. He was able to demonstrate an engaging and persuasive style and tried to inspire The role player when discussing what could be done more effectively. The candidate needs to explore the risks attached to The role player’s plan and consider the resources required to make it successful when implementing it. The candidate offered a lot of praise and tried to ensure that The role player felt like a valued member of the team. Some evidence provided of an adaptable communication style, but more assertion around the communication issue with Other staff members would have been beneficial."},
// 														{cells:"4"}
// 													]
// 												}											
												
// 											]	
// 					}
// 			]
// 			};
			
console.log(" BAD MAN " + JSON.stringify(info));


// console.log(" CORRECT " + JSON.stringify(info2));

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
pObj.addImage ( path.resolve(__dirname, '/home/ubuntu/api/report_generation_assets/company_icon.png' ) );
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
// pObj.addLineBreak ();pObj.addLineBreak ();
 docx.putPageBreak ();

// Page 2 
for(i in info.activities){
	console.log("THE LENGTH OF THE AC is = " + info.activities.length);
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
				//console.log('this means it is another row');
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
		docx.putPageBreak ();
	}	


	
	




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

			}	else{
				//console.log('this means it is another row');
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
		docx.putPageBreak ();	
	}


	





// 	if(info.activities[i].activity_report_components.length > 0){
// 		console.log("THE LENGTH IS : " +info.activities[i].activity_report_components.length);
		
// 		 for(zk in info.activities[i].activity_report_components){
		
// 			console.log("The question title is = "+info.activities[i].activity_report_components[zk]);
			
// 			var pObj = docx.createP ();
// 			pObj.addText (info.activities[i].activity_report_components[zk].title, { font_face: 'Arial', font_size: 17 });
		
// 			pObj.addLineBreak ();
			
// 			var tableStyle = {
				
// 				tableSize: 4000,
// 				tableBorder:1,
// 				tableColor: "ada",
// 				tableAlign: "left",
// 				tableFontFamily: "Arial",
// 				borders: true
// 			}

// 			var table=[[],[]];
		
// 			for(j in info.activities[i].activity_report_components[zk].table){
// 				// split string down 
// 				if(table[0].length == 0){
// 					console.log('this means its the first row');

// 					// split sring 
// 					var arrayOfColumns = info.activities[i].activity_report_components[zk].table[j].cells.split("|");
// 					console.log(arrayOfColumns);

// 					for(k in arrayOfColumns){
// 						var columnObject = {
// 											val: arrayOfColumns[k]
// 											,
// 											opts: {
// 												cellColWidth: 2000,
// 												b:true,
// 												sz: '22',
// 												fontFamily: "Arial",
// 												shd: {
// 									                fill: "92CDDC",
									               
// 									                "themeFillTint": "80"
// 									            }
// 											}
// 										};
// 						table[0][k] = columnObject;
// 					}
// 					//console.log(table);

// 				}else{
// 					console.log('this means it is another row');
// 					var arrayOfColumns = info.activities[i].activity_report_components[zk].table[j].cells.split("|");
// 					console.log(arrayOfColumns);

// 					var cellsRow = [];
// 					if(arrayOfColumns.length > 1){
// 						for(k in arrayOfColumns){
// 							cellsRow.push(arrayOfColumns[k]);
// 						}
// 					}else{
// 						// this means the row is a single one 
// 						cellsRow.push({val: arrayOfColumns[0], opts: {gridSpan: table[0].length}});
// 					}

// 					table[1].push(cellsRow);
// 					//console.log(table);

// 				}


// 			}

// 			var pObj = docx.createTable (table, tableStyle);
// 			docx.putPageBreak ();
// 		}

// 	}




// }



	if(info.activities[i].activity_report_components.length > 0){
		console.log("THE LENGTH IS : " +info.activities[i].activity_report_components.length);
		
		 for(zk in info.activities[i].activity_report_components){
		
			console.log("The question title is = "+info.activities[i].activity_report_components[zk]);
			
			var pObj = docx.createP ();
			pObj.addText (info.activities[i].activity_report_components[zk].title, { font_face: 'Arial', font_size: 17 });
		
			pObj.addLineBreak ();
			
			var tableStyle = {
				
				tableSize: 300,
				tableColWidth: 7261,
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

						if(k ==0){
							var columnObject = {
											val: arrayOfColumns[k]
											,
											opts: {
												cellColWidth: 2261,
												b:true,
												sz: '22',
												fontFamily: "Arial",
												shd: {
									                fill: "92CDDC",
									               
									                "themeFillTint": "80"
									            }
											}
										};
						}else{
							var columnObject = {
											val: arrayOfColumns[k]
											,
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
						}
						
						table[0][k] = columnObject;
					}
					//console.log(table);

				}else{
					console.log('this means it is another row');
					var arrayOfColumns = info.activities[i].activity_report_components[zk].table[j].cells.split("|");
					console.log(arrayOfColumns);

					// var cellsRow = [];
					// if(arrayOfColumns.length > 1){
					// 	for(k in arrayOfColumns){
					// 		cellsRow.push(arrayOfColumns[k]);
					// 	}
					// }else{
					// 	// this means the row is a single one 
					// 	cellsRow.push({val: arrayOfColumns[0], opts: {gridSpan: table[0].length}});
					// }

					table.push(arrayOfColumns);
					//console.log(table);

				}


			}

			var pObj = docx.createTable (table, tableStyle);
			docx.putPageBreak ();
		}

	}




}

var success =true;
console.log("SAVE PATH END = " + '/home/ubuntu/api/reports/'+ ACID +'/'+fileNameString);
var savePath = '/home/ubuntu/api/reports/'+ ACID +'/'+fileNameString;
var out = fs.createWriteStream ( '/home/ubuntu/api/reports/'+ ACID +'/'+fileNameString);
// wirite file handle in db 
console.log("createWriteStream NOW ");
out.on ( 'error', function ( err ) {
	console.log ( "ERRROR BRO " + err );
});
//async.waterfall([async.apply(grabDataAndFormat,query,ACAcitivtyTypes,info)], function (err, result) { console.log("DONE"); });
         
async.waterfall ([
	function ( done ) {
		out.on ( 'close', function () {
			console.log ( 'Finish to create a DOCX file.' );

			var postmark = require("postmark");
			var client = new postmark.Client("7424f227-688f-4979-93ac-e7b35d2de10d");
			var fs = require('fs');
			 
			client.sendEmail({
			    "From": "elliotcampbelton@apptitudedigitalsolutions.com", 
			    "To": "michaelblakley@apptitudedigitalsolutions.com", 
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
