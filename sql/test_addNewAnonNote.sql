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

CALL `addNewAnonNote`("12345678901234", NOW(), "blah blah", null, null, null, null, '0', '0', 4, '0', '{"a": 4}', '{"b": 3}');

SELECT * FROM `notes_versions`;
SELECT * FROM `versions`;

DELETE FROM `notesDB`.`versions` WHERE `note_id`='12345678901234' and`revision`='1';
DELETE FROM `notesDB`.`notes_versions` WHERE `note_id`='12345678901234' and`username`='anon';
