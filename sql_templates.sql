
# Create 
CREATE DATABASE MACRO;
USE MACRO;

# Macro tables
CREATE TABLE `Companies` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_name` text,
  `create_date` datetime DEFAULT NULL,
  `billing_date` datetime DEFAULT NULL,
  `plan_type` int(11) DEFAULT NULL,
  `account_number` text,
  `account_sort` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Invoices'
CREATE TABLE `Invoices` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` text,
  `create_date` datetime DEFAULT NULL,
  `value_of_bill` float DEFAULT NULL,
  `plan_type` int(11) DEFAULT NULL,
  `VAT_number` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int(11) DEFAULT NULL,
  `username` text,
  `password` text,
  `passcode` text,
  `phone_number` text,
  `role` text,
  `first` text,
  `last` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


# Assessment Centers Macro DB
CREATE DATABASE AC_MACRO;
USE AC_MACRO;

CREATE TABLE `Assessment_Center_templates` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` text,
  `created_on` datetime DEFAULT NULL,
  `participants_count` text,
  `title` text,
  `description` text,
  `to_be_conducted_on` datetime DEFAULT NULL,
  `activity_ids` text,
  `activity_types` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `Assessment_Center_activities` (
  `activity_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ac_id` int(11),
  `company_id` text,
  `created_on` datetime DEFAULT NULL,
  `title` text,
  `description` text,
  `activity_type` text,
  PRIMARY KEY (`activity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

# Interview
-- Create syntax for TABLE 'Interview_candidates_id'
CREATE TABLE `Assessment_Center_candidates_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `First` text,
  `Last` text,
  `Email` text,
  `Role` text,
  `Other` text,
  `created_on` datetime DEFAULT NULL,
  `set_activities` text,
  `completed_activities` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;












"CREATE TABLE `Interview_questions_"+intertedrow+"` (  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,  `question_id` int(11),  `section_id` int(11) DEFAULT NULL,  `section_title` text,  `section_text` text,  `section_media_url` text,  `section_media_type` text,  `question` text,  `prompts` text,  `answer_type` int(11) DEFAULT NULL,  `answer_options` text,  PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;",
"CREATE TABLE `Interview_results_"+intertedrow+"` (  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,  `candidate_id` int(11) DEFAULT NULL,  `question_id` int(11) DEFAULT NULL,  `section_id` int(11) DEFAULT NULL,  `answer_text` text,  `answer_wav` text,  `answer_notes` text,   PRIMARY KEY (`result_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;",
"CREATE TABLE `Interview_review_questions_"+intertedrow+"` (  `review_question_id` int(11) unsigned NOT NULL AUTO_INCREMENT,  `review_question` text,  `positive_indicators` text,  `negative_indicators` text,  PRIMARY KEY (`review_question_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;",
"CREATE TABLE `Interview_review_results_"+intertedrow+"` (  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,  `candidate_id` int(11) DEFAULT NULL,  `question_id` int(11) DEFAULT NULL,  `answer_text` text,  `answer_selection` text,  PRIMARY KEY (`result_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;"

-- Create syntax for TABLE 'Interview_questions_id'
CREATE TABLE `Interview_questions_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `question_id` int(11),
  `section_id` int(11) DEFAULT NULL,
  `section_title` text,
  `section_text` text,
  `section_media_url` text,
  `section_media_type` text,
  `question` text,
  `prompts` text,
  `answer_type` int(11) DEFAULT NULL,
  `answer_options` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Interview_results_id'
CREATE TABLE `Interview_results_id` (
  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `candidate_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `answer_text` text,
  `answer_wav` text,
  `answer_notes` text, 
  PRIMARY KEY (`result_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Interview_review_questions_id'
CREATE TABLE `Interview_review_questions_id` (
  `review_question_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `review_question` text,
  `positive_indicators` text,
  `negative_indicators` text,
  PRIMARY KEY (`review_question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Interview_review_results_id'
CREATE TABLE `Interview_review_results_id` (
  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `candidate_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `answer_text` text,
  `answer_selection` text,
  PRIMARY KEY (`result_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




"CREATE TABLE `Presentation_"+intertedrow+"` (  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,  `presentation_info_ref` text,  `presentation_info_text` text,  PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;",
"CREATE TABLE `Presentation_results_"+intertedrow+"` (  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,  `candidate_id` int(11) DEFAULT NULL,  `question_id` int(11) DEFAULT NULL,  `section_id` int(11) DEFAULT NULL,  `answer_text` text,  `answer_wav` text,  `answer_notes` text,   PRIMARY KEY (`result_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;",
"CREATE TABLE `Presentation_review_questions_"+intertedrow+"` (  `review_question_id` int(11) unsigned NOT NULL AUTO_INCREMENT,  `review_question` text,  `positive_indicators` text,  `negative_indicators` text,  PRIMARY KEY (`review_question_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;",
"CREATE TABLE `Presentation_review_results_"+intertedrow+"` (  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,  `candidate_id` int(11) DEFAULT NULL,  `question_id` int(11) DEFAULT NULL,  `answer_text` text,  `answer_selection` text,  PRIMARY KEY (`result_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;"

-- Create syntax for TABLE 'Interview_questions_id'
CREATE TABLE `Presentation_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `presentation_info_ref` text,
  `presentation_info_text` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Interview_results_id'
CREATE TABLE `Presentation_results_id` (
  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `candidate_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `answer_text` text,
  `answer_wav` text,
  `answer_notes` text, 
  PRIMARY KEY (`result_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Interview_review_questions_id'
CREATE TABLE `Presentation_review_questions_id` (
  `review_question_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `review_question` text,
  `positive_indicators` text,
  `negative_indicators` text,
  PRIMARY KEY (`review_question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Interview_review_results_id'
CREATE TABLE `Presentation_review_results_id` (
  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `candidate_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `answer_text` text,
  `answer_selection` text,
  PRIMARY KEY (`result_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;






"CREATE TABLE `Roleplay_"+intertedrow+"` (  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,  `roleplay_info_ref` text,  `roleplay_info_text` text,  PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;",
"CREATE TABLE `Roleplay_results_"+intertedrow+"` (  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,  `candidate_id` int(11) DEFAULT NULL,  `question_id` int(11) DEFAULT NULL,  `section_id` int(11) DEFAULT NULL,  `answer_text` text,  `answer_wav` text,  `answer_notes` text,   PRIMARY KEY (`result_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;",
"CREATE TABLE `Roleplay_review_questions_"+intertedrow+"` (  `review_question_id` int(11) unsigned NOT NULL AUTO_INCREMENT,  `review_question` text,  `positive_indicators` text,  `negative_indicators` text,  PRIMARY KEY (`review_question_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;",
"CREATE TABLE `Roleplay_review_results_"+intertedrow+"` (  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,  `candidate_id` int(11) DEFAULT NULL,  `question_id` int(11) DEFAULT NULL,  `answer_text` text,  `answer_selection` text,  PRIMARY KEY (`result_id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;"

-- Create syntax for TABLE 'Interview_questions_id'
CREATE TABLE `Roleplay_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `roleplay_info_ref` text,
  `roleplay_info_text` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Interview_results_id'
CREATE TABLE `Roleplay_results_id` (
  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `candidate_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `answer_text` text,
  `answer_wav` text,
  `answer_notes` text, 
  PRIMARY KEY (`result_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Interview_review_questions_id'
CREATE TABLE `Roleplay_review_questions_id` (
  `review_question_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `review_question` text,
  `positive_indicators` text,
  `negative_indicators` text,
  PRIMARY KEY (`review_question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Interview_review_results_id'
CREATE TABLE `Roleplay_review_results_id` (
  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `candidate_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `answer_text` text,
  `answer_selection` text,
  PRIMARY KEY (`result_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;














# TEST Macro DB
CREATE DATABASE TEST_MACRO;
USE TEST_MACRO;
# TEST

-- Create syntax for TABLE 'Test_admin_id'
CREATE TABLE `Test_admin_TESTNUMBER` (
  `candidate_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `candidate_first` text,
  `candidate_last` text,
  `candidate_email` text,
  `currently_on_question` int(11) DEFAULT NULL,
  `currently_on_section` int(11) DEFAULT NULL,
  PRIMARY KEY (`candidate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Test_applicants_id'
CREATE TABLE `Test_applicants_TESTNUMBER` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `First` text,
  `Last` text,
  `Email` text,
  `DoB` timestamp NULL DEFAULT NULL,
  `min_stage_of_test` int(11) DEFAULT NULL,
  `test_stage_state` text,
  `other` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- Create syntax for TABLE 'Test_id'
CREATE TABLE `Test_intro_TESTNUMBER` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `question_id` int(11) 
  `section_id` int(11) DEFAULT NULL,
  `section_title` text,
  `section_text` text,
  `test_info_ref` text,
  `section_media_url` text,
  `section_media_type` text,
  `section_question_count` int(11) DEFAULT NULL,
  `question` text,
  `question_media_url` text,
  `question_media_type` text,
  `answer_type` int(11) DEFAULT NULL,
  `answer_options` text,
  `answer_catergories` int(11) DEFAULT NULL,
  `correct_answer` text,
  `time_allowed_in_section` int(11) DEFAULT NULL,
  `test_results_file_ref` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Test_id'
CREATE TABLE `Test_TESTNUMBER` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `question_id` int(11) 
  `section_id` int(11) DEFAULT NULL,
  `section_title` text,
  `section_text` text,
  `test_info_ref` text,
  `section_media_url` text,
  `section_media_type` text,
  `section_question_count` int(11) DEFAULT NULL,
  `question` text,
  `question_media_url` text,
  `question_media_type` text,
  `answer_type` int(11) DEFAULT NULL,
  `answer_options` text,
  `answer_catergories` int(11) DEFAULT NULL,
  `correct_answer` text,
  `time_allowed_in_section` int(11) DEFAULT NULL,
  `test_results_file_ref` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Test_results_id'
CREATE TABLE `Test_results_TESTNUMBER` (
  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `candidate_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `answer` text,
  `was_correct` int(11) DEFAULT NULL,
  `time_taken_on_question` int(11) DEFAULT NULL,
  PRIMARY KEY (`result_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- Create syntax for TABLE 'Interview_review_questions_id'
CREATE TABLE `Test_feedback_TESTNUMBER` (
  `feedback_question_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `feedback_question` text,
  `feedback_answer_type` int(11) DEFAULT NULL,
  `feedback_answer_options` text,
  PRIMARY KEY (`feedback_question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- Create syntax for TABLE 'Test_results_id'
CREATE TABLE `Test_feedback_results_TESTNUMBER` (
  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `candidate_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `answer` text,
  PRIMARY KEY (`result_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `Test_templates` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `to_be_conducted_on` datetime DEFAULT NULL,
  `test_title` text,
  `description` text,
  `should_be_returned` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;