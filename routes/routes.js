var appRouter = function(app) {


//test

var test = require('./test'); 
	app.get("/",test.hi);


// 25.  GET the test infro for a particular test_id 
var getTestIntroFilehandle = require('./get_test_intro'); 
	app.post("/v1/companies/tests/:test_id/intro",getTestIntroFilehandle.getTestIntro); 
// GENERAL 
// 0. Create a company's account
var postCreateCompanyFilehandle = require('./create_company'); 
	app.post("/v1/company/create",postCreateCompanyFilehandle.createCompany);
// 0.1 creat new user
	var postCreateUserFilehandle = require('./create_user'); 
	app.post("/v1/company/createuser",postCreateUserFilehandle.createUser);

// 1. /v1/user/login POST to login
   var postLoginFilehandle = require('./login'); 
	app.post("/v1/user/login",postLoginFilehandle.login);

// 22. /v1/user/logout POST to logout
   var postLogoutFilehandle = require('./logout'); 
	app.post("/v1/user/logout",postLogoutFilehandle.logout);

// 23. /v1/time GET for the current time on the sever. this is important as will need to identify when a user comes back and establishes how much time there is left for both the section and the test as a whole.
	var getTimeFilehandle = require('./time'); 
	app.post("/v1/time",getTimeFilehandle.getTime);

// //24. /v1/app/closed/:candidate_id POST to identify that a user has left the app. // this is for the admins tablet
//     var postleftAppFilehandle = require('./leftApp'); 
// 	app.post("/v1/app/closed/:candidate_id",postleftAppFilehandle.leftApp);

// //25. /v1/app/open/:candidate_id POST to identify a user has re-entered the app // this is for the admins tablet
// 	var postopenAppFilehandle = require('./openApp'); 
// 	app.post("/v1/app/open/:candidate_id",postopenAppFilehandle.openApp);


	// INTERVIEW

	// Create Interview Stubs needed here , i.e add interview section , add interview quesiton with prompts , add interview section time 

//24. retuns a list of activiites gven a specicfied ac id 
var getcreateACFilehandle = require('./create_ac'); 
app.post("/v1/company/createac",getcreateACFilehandle.createAC);


//24. retuns a list of activiites gven a specicfied ac id 
var getActivitiesFilehandle = require('./get_actvities'); 
app.post("/v1/companies/:company_id/ac/:ac_id/activities",getActivitiesFilehandle.getActivities); 

		//2. /v1/companies/interviews GET for interviews schedule
		var getInterviewsFilehandle = require('./get_assessmentcentres'); 
		app.post("/v1/companies/assessmentcentres/:company_id",getInterviewsFilehandle.getACs);

// 4. /v1/companies/interview/:candidate_id GET of candidates results (having scored for a tother review)
var getInterviewResultsFilehandle = require('./get_interview_results'); 
app.get("/v1/companies/interview/:interview_id/:candidate_id",getInterviewResultsFilehandle.getInterviewsResults);

// // 5. /v1/companies/interview/play/:record_id GET of an audio file for playback
var getPlayRecordFilehandle = require('./play_record'); 
app.get("/v1/companies/interview/:interview_id/play/:record_id",getPlayRecordFilehandle.play);

// 6. /v1/companies/interview/:candidate_id PUT of an audio file to server
var putaudioFilesFilehandle = require('./upload'); 
app.put("/v1/companies/interview/:candidate_id",putaudioFilesFilehandle.upload);

// 7. /v1/companies/interview/:candidate_id/:wavFileName Confirming upload has been successful for audio file
var postConfirmUploadFilehandle = require('./confirm_upload'); 
app.post("/v1/companies/interview/:candidate_id/:wavFileName",postConfirmUploadFilehandle.confirmUpload);

// 8. /v1/companies/interview/:interview_id GET on interview questions and prompts
var getInterviewDetailsFilehandle = require('./get_interview'); 
app.get("/v1/companies/interview/:interview_id",getInterviewDetailsFilehandle.getInterviewDetails);

		// 9. /v1/companies/interview PUT of a new candidate
		var postNewCandidateFilehandle = require('./add_candidate'); 
		app.post("/v1/companies/assessmentcentre/addcandidate/:ac_id",postNewCandidateFilehandle.addCandidate);

		// 10. /v1/companies/interview/:interview_id GET for interview candidates
		var getCandidateFilehandle = require('./get_assessmentcentres_candidates'); 
			app.post("/v1/companies/assessmentcentres/candidates/:ac_id",getCandidateFilehandle.getAssessmentCentresCandidates);



// 	// TESTS

// 	// create Test API needed, fulfilling , sections, time in each section allowed,  number of questions, test material, section URLS , questions, answer types, answers in answer types, correct answers, etc ... 
	
// 11. /v1/companies/tests/:company_id GET for tests schedule
var getTestScheduleFilehandle = require('./get_test_schedule'); 
	app.post("/v1/companies/tests/:company_id",getTestScheduleFilehandle.getTestSchedule);


//26 does a test exist and should it be conducted today
var isTestIDValidFilehandle = require('./is_testid_valid'); 
	app.post("/v1/companies/test/validation/:TEST",isTestIDValidFilehandle.validateTestID);


// // 12. /v1/companies/tests/:test_id GET a tests for a specific test id
// var getTestFilehandle = require('./get_test'); 
// 	app.get("/v1/companies/tests/:test_id",getTestFilehandle.getTest);

// // 26.  GET the test feedback for a particular test_id 
// var getTestFeebackFilehandle = require('./get_feedback_intro'); 
// 	app.post("/v1/companies/tests/:test_id/feedback",getTestFeebackFilehandle.getFeedback); // NEEDS IMP<EMNTING 

// 26.  GET the test feedback for a particular test_id 
var setTestFeedbackResutlsFilehandle = require('./set_feedback_intro'); 
	app.post("/v1/companies/tests/:test_id/feedback/:candidate_id",setTestFeedbackResutlsFilehandle.setFeedback); // NEEDS IMP<EMNTING 

// 27. get test status 
var getTestStatusFilehandle = require('./get_test_status_for_user'); 
	app.post("/v1/companies/test/:test_id/status",getTestStatusFilehandle.getstatus); // NEEDS IMP<EMNTING 




//13. /v1/companies/test/participants/:test_id GET for test participants
var getTestParticipantsFilehandle = require('./get_test_participants'); 
	app.post("/v1/companies/test/participants/:test_id",getTestParticipantsFilehandle.getTestParticipants);

//13.1 /v1/companies/test/participants/add PUT to add a new test participant
var putParticipantFilehandle = require('./add_participant'); 
	app.post("/v1/companies/test/:test_id/participants/add",putParticipantFilehandle.addParticipant);

//14. /v1/companies/test/start/:test_id POST to start test
var setTestPageFilehandle = require('./set_test_page'); 
	app.post("/v1/companies/test/set/:test_id",setTestPageFilehandle.setPage);

// //15. /v1/companies/test/sectionnext/:test_id POST to move to next sections intro
// var postNextSectionFilehandle = require('./next_section'); 
// 	app.post("/v1/companies/test/sectionnext/:test_id",postNextSectionFilehandle.nextSection);

// //16. /v1/companies/test/startsection/:test_id POST to start next section
// var postStartNextSectionFilehandle = require('./start_next_section'); 
// 	app.post("/v1/companies/test/startsection/:test_id",postStartNextSectionFilehandle.startNextSection);

// //17. /v1/companies/test/stop/:test_id POST to stop
// var postStopTestFilehandle = require('./stop_test'); 
// 	app.post("/v1/companies/test/stop/:test_id",postStopTestFilehandle.stopTest);

//19. /v1/companies/test/answer/:test_id/:candidate_id/:question_id/:section_id POST answer to question
var postAnswerFilehandle = require('./answer_question'); 
	app.post("/v1/companies/test/answer/:test_id",postAnswerFilehandle.answerQuestion);

// //20. /v1/companies/test/completesection/:test_id/:section_id/:candidate_id POST to identify section completion
// var postSectionCompleteFilehandle = require('./section_complete'); 
// 	app.post("/v1/companies/test/completesection/:test_id/:section_id/:candidate_id",postSectionCompleteFilehandle.sectionComplete);

// //21. /v1/companies/test/completetest/:test_id/:candidate_id POST to identify test completion
// var postTestCompleteFilehandle = require('./test_completion'); 
// 	app.post("/v1/companies/test/completetest/:test_id/:candidate_id",postTestCompleteFilehandle.testCompletion);


}
 
module.exports = appRouter;

