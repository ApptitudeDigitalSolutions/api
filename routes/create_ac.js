exports.createAC = function (req, res) {
    
    var detail= {company_id:1,
                 title:"Mock AC LSBU",
                 description:"A test AC containing Interview, Presentation and Roleplay",
                 activity_titles:"Demo Interview,Demo Presentation,Demo Roleplay",
                 activity_types:"i,p,rp"};

    console.log(detail);
    
    var company_id = detail.company_id;
    var title = detail.title;
    var description = detail.description;
    var activity_titles = detail.activity_titles;
    var activity_types = detail.activity_types;

    var activity_titles_array = activity_titles.split(",");
    var activity_types_array = activity_types.split(",");

    var intertedrow ;
    var ac_id_generated;

    var arrayofActivity_ids = [];

     var mysql = require('mysql');
    var connection = mysql.createConnection({ host: 'localhost', user: 'root', password: 'smashing', database: 'AC_MACRO' });
    connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; }});

    var async = require('async');
     async.series([function(callback) {
            createCompanyNow(callback);
    }]);

     function createCompanyNow(callback) {
            var query = 'INSERT INTO Assessment_Center_templates (company_id,created_on, participants_count,title,description,to_be_conducted_on, activity_ids,activity_types) VALUES (\'' + company_id + '\',NOW(),0,\'' + title + '\',\'' + description + '\',NOW(),\'\',\'\');';
            connection.query(query, function(err, result) {if (err) { console.log('Error : The SQL statement is realy batty'); return;} else { 
            console.log("STATUS >>>>> Created new AC template");
            
            ac_id_generated = result.insertId;

                var query1 = "CREATE TABLE Assessment_Center_candidates_"+ac_id_generated+" (  id int(11) unsigned NOT NULL AUTO_INCREMENT,  First text,  Last text,  Email text,  Role text,  Other text,  created_on datetime DEFAULT NULL,  set_activities text,  completed_activities text,  PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=latin1;";
                connection.query(query1, function(err, rows) {if (err) { console.log('Error : The SQL statement is realy batty'); return;} else { 
                console.log("STATUS >>>>> Created new AC candidates table");


            for(i in activity_types_array){
                var activity = activity_types_array[i];
                var activity_title = activity_titles_array[i];

                console.log("STATUS >>>>> type >> " + activity + " With title " + activity_title);
                var query3 = "INSERT INTO Assessment_Center_activities (ac_id,company_id, created_on, title, description, activity_type) VALUES ("+ac_id_generated+","+company_id+", NOW(), \'"+activity_title+"\', \'NULL\', \'"+activity+"\');";
                //console.log(query3);
                connection.query(query3, function(err, result) {if (err) { console.log('Error : '+err); return;} else { 
                console.log("STATUS >>>>> inserted new activity of type >> " + activity + " With title " + activity_title);
                intertedrow = result.insertId;
                arrayofActivity_ids.push(intertedrow);
                    // now we need to creat the needed tables for each 

                    if(activity == "i"){
                        var arrayOfQuesries =["CREATE TABLE Interview_questions_"+intertedrow+" (  id int(11) unsigned NOT NULL AUTO_INCREMENT,  question_id int(11),  section_id int(11) DEFAULT NULL,  section_title text,  section_text text,  section_media_url text,  section_media_type text,  question text,  prompts text,  answer_type int(11) DEFAULT NULL,  answer_options text,  PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=latin1;","CREATE TABLE Interview_results_"+intertedrow+" (  result_id int(11) unsigned NOT NULL AUTO_INCREMENT,  candidate_id int(11) DEFAULT NULL,  question_id int(11) DEFAULT NULL,  section_id int(11) DEFAULT NULL,  answer_text text,  answer_wav text,  answer_notes text,   PRIMARY KEY (result_id)) ENGINE=InnoDB DEFAULT CHARSET=latin1;","CREATE TABLE Interview_review_questions_"+intertedrow+" (  review_question_id int(11) unsigned NOT NULL AUTO_INCREMENT,  review_question text,  positive_indicators text,  negative_indicators text,  PRIMARY KEY (review_question_id)) ENGINE=InnoDB DEFAULT CHARSET=latin1;","CREATE TABLE Interview_review_results_"+intertedrow+" (  result_id int(11) unsigned NOT NULL AUTO_INCREMENT,  candidate_id int(11) DEFAULT NULL,  question_id int(11) DEFAULT NULL,  answer_text text,  answer_selection text,  PRIMARY KEY (result_id)) ENGINE=InnoDB DEFAULT CHARSET=latin1;"]; 
                        for(j in arrayOfQuesries){
                            var thisquery = arrayOfQuesries[j];
                            //console.log(thisquery);
                            connection.query(thisquery, function(err, rows) {if (err) { console.log('Error : The SQL statement is realy batty'); return;} else { 
                            
                            }});
                        }
                        console.log("STATUS >>>>> Created all INTERVIEW TABLES");
                       
                    }

                    if(activity == "p"){
                        var arrayOfQuesries =["CREATE TABLE Presentation_"+intertedrow+" (  id int(11) unsigned NOT NULL AUTO_INCREMENT,  presentation_info_ref text,  presentation_info_text text,  PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=latin1;","CREATE TABLE Presentation_results_"+intertedrow+" (  result_id int(11) unsigned NOT NULL AUTO_INCREMENT,  candidate_id int(11) DEFAULT NULL,  question_id int(11) DEFAULT NULL,  section_id int(11) DEFAULT NULL,  answer_text text,  answer_wav text,  answer_notes text,   PRIMARY KEY (result_id)) ENGINE=InnoDB DEFAULT CHARSET=latin1;","CREATE TABLE Presentation_review_questions_"+intertedrow+" (  review_question_id int(11) unsigned NOT NULL AUTO_INCREMENT,  review_question text,  positive_indicators text,  negative_indicators text,  PRIMARY KEY (review_question_id)) ENGINE=InnoDB DEFAULT CHARSET=latin1;","CREATE TABLE Presentation_review_results_"+intertedrow+" (  result_id int(11) unsigned NOT NULL AUTO_INCREMENT,  candidate_id int(11) DEFAULT NULL,  question_id int(11) DEFAULT NULL,  answer_text text,  answer_selection text,  PRIMARY KEY (result_id)) ENGINE=InnoDB DEFAULT CHARSET=latin1;"];
                        for(j in arrayOfQuesries){
                            var thisquery = arrayOfQuesries[j];
                            //console.log(thisquery);
                            connection.query(thisquery, function(err, rows) {if (err) { console.log('Error : The SQL statement is realy batty'); return;} else { 
                            //console.log("Company successfully created");
                            }});
                        }
                         console.log("STATUS >>>>> Created all PRESENTATION TABLES");

                    }

                    if(activity == "rp"){
                        var arrayOfQuesries =["CREATE TABLE Roleplay_"+intertedrow+" (  id int(11) unsigned NOT NULL AUTO_INCREMENT,  roleplay_info_ref text,  roleplay_info_text text,  PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=latin1;","CREATE TABLE Roleplay_results_"+intertedrow+" (  result_id int(11) unsigned NOT NULL AUTO_INCREMENT,  candidate_id int(11) DEFAULT NULL,  question_id int(11) DEFAULT NULL,  section_id int(11) DEFAULT NULL,  answer_text text,  answer_wav text,  answer_notes text,   PRIMARY KEY (result_id)) ENGINE=InnoDB DEFAULT CHARSET=latin1;","CREATE TABLE Roleplay_review_questions_"+intertedrow+" (  review_question_id int(11) unsigned NOT NULL AUTO_INCREMENT,  review_question text,  positive_indicators text,  negative_indicators text,  PRIMARY KEY (review_question_id)) ENGINE=InnoDB DEFAULT CHARSET=latin1;","CREATE TABLE Roleplay_review_results_"+intertedrow+" (  result_id int(11) unsigned NOT NULL AUTO_INCREMENT,  candidate_id int(11) DEFAULT NULL,  question_id int(11) DEFAULT NULL,  answer_text text,  answer_selection text,  PRIMARY KEY (result_id)) ENGINE=InnoDB DEFAULT CHARSET=latin1;"];
                        for(j in arrayOfQuesries){
                            var thisquery = arrayOfQuesries[j];
                            //console.log(thisquery);
                            connection.query(thisquery, function(err, rows) {if (err) { console.log('Error : The SQL statement is realy batty'); return;} else { 
                            //console.log("Company successfully created");
                            }});
                        }
                         console.log("STATUS >>>>> Created all ROLEPLAY TABLES");
                    }

                   var queryq = 'UPDATE Assessment_Center_templates SET activity_ids = \'' + arrayofActivity_ids + '\' WHERE id = '+ac_id_generated+';';
                        connection.query(queryq, function(err, result) {if (err) { console.log('Error : The SQL statement is realy batty'); return;} else { 
                        console.log("STATUS >>>>> UPDATE AC with ids " + arrayofActivity_ids);
                    }}); 
                }});
            }

            }});
        
        // update the list of actitvity ids
     
    // connection.end();
    }});
        

   res.send(200);
}

}