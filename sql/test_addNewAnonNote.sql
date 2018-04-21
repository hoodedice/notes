use notesDB;

/** CREATE PROCEDURE `addNewAnonNote` (
	note_id VARCHAR(14),
	note_time DATETIME, 
	note TEXT,
	title VARCHAR(512),
	filetype VARCHAR(5), 
	description TEXT,  
	language_id SMALLINT,
	wrap_style BINARY,
    indent_style BINARY,
	indent_size BINARY,
    is_private BINARY,
    folder TEXT, -- actually JSON
    tags TEXT -- actually JSON
) **/
INSERT IGNORE INTO `notesDB`.`users` (`username`, `email`, `fname`, `lname`, `password`, `join_date`) VALUES ("anon", "anon@hoodedice.net", NULL, NULL, "0", "2018-04-14T14:26:36");

CALL `addNewAnonNote`("20180414ytVWLI", "2018-04-14T14:26:36", "blah blah test", "Untitled", "txt", null, null, '0', '0', 4, '0', '{"a": 4}', '{"b": 3}');

SELECT * FROM `notes_versions`;
SELECT * FROM `versions`;

DELETE FROM `notesDB`.`versions` WHERE `note_id`='12345678901234' and`revision`='1';
DELETE FROM `notesDB`.`notes_versions` WHERE `note_id`='12345678901234' and`user_id`='1';
