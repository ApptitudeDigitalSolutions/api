
# Create 
CREATE DATABASE MACRO;
USE MACRO;

# Macro tables
-- Create syntax for TABLE 'Companies'
CREATE TABLE `Companies` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_name` text,
  `create_date` datetime DEFAULT NULL,
  `billing_date` datetime DEFAULT NULL,
  `plan_type` int(11) DEFAULT NULL,
  `account_number` int(11) DEFAULT NULL,
  `account_sort` int(11) DEFAULT NULL,
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

-- Create syntax for TABLE 'Users'
CREATE TABLE `Users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int(11) DEFAULT NULL,
  `username` text,
  `password` text,
  `passcode` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


# Interview Macro DB
CREATE DATABASE INTERVIEW_MACRO;
USE INTERVIEW_MACRO;

# Interview

-- Create syntax for TABLE 'Interview_candidates_id'
CREATE TABLE `Interview_candidates_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `First` text,
  `Last` text,
  `Email` text,
  `Role` text,
  `Other` text,
  `created_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Interview_questions_id'
CREATE TABLE `Interview_questions_id` (
  `question_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `section_id` int(11) DEFAULT NULL,
  `section_title` text,
  `section_text` text,
  `section_media_url` text,
  `section_media_type` text,
  `question` text,
  `prompts` text,
  `answer_type` int(11) DEFAULT NULL,
  `answer_options` text,
  PRIMARY KEY (`question_id`)
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
  `review_answer_type` int(11) DEFAULT NULL,
  `review_answer_options` text,
  PRIMARY KEY (`review_question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Interview_review_results_id'
CREATE TABLE `Interview_review_results_id` (
  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `candidate_id` int(11) DEFAULT NULL,
  `review_question_id` int(11) DEFAULT NULL,
  `review_answer_values` text,
  `review_answer_notes` text,
  PRIMARY KEY (`result_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Interview_templates'
CREATE TABLE `Interview_templates` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `participants_count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;






# TEST Macro DB
CREATE DATABASE TEST_MACRO;
USE TEST_MACRO;
# TEST

-- Create syntax for TABLE 'Test_admin_id'
CREATE TABLE `Test_admin_id` (
  `candidate_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `candidate_first` text,
  `candidate_last` text,
  `candidate_email` text,
  `currently_on_question` int(11) DEFAULT NULL,
  `currently_on_section` int(11) DEFAULT NULL,
  PRIMARY KEY (`candidate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Test_applicants_id'
CREATE TABLE `Test_applicants_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first` text,
  `last` text,
  `email` text,
  `dob` datetime DEFAULT NULL,
  `min_stage_of_test` int(11) DEFAULT NULL,
  `test_stage_state` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Test_id'
CREATE TABLE `Test_id` (
  `question_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `section_id` int(11) DEFAULT NULL,
  `section_title` text,
  `test_info_ref` text,
  `section_media_url` text,
  `question` text,
  `question_media_url` text,
  `answer_type` int(11) DEFAULT NULL,
  `answer_options` text,
  `answer_catergories` int(11) DEFAULT NULL,
  `correct_answer` text,
  `time_allowed_in_section` int(11) DEFAULT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Test_results_id'
CREATE TABLE `Test_results_id` (
  `result_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `candidate_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `answer` text,
  `was_correct` int(11) DEFAULT NULL,
  `time_taken_on_question` int(11) DEFAULT NULL,
  PRIMARY KEY (`result_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create syntax for TABLE 'Test_templates'
CREATE TABLE `Test_templates` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `to_be_conducted_on` datetime DEFAULT NULL,
  `test_title` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;