-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema notesDB
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `notesDB` ;

-- -----------------------------------------------------
-- Schema notesDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `notesDB` DEFAULT CHARACTER SET utf8 ;
USE `notesDB` ;

-- -----------------------------------------------------
-- Table `notesDB`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `notesDB`.`users` ;

CREATE TABLE IF NOT EXISTS `notesDB`.`users` (
  `IDuser` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `fname` VARCHAR(45) NULL,
  `lname` VARCHAR(45) NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(2048) NOT NULL,
  `join_date` DATETIME NOT NULL,
  PRIMARY KEY (`IDuser`),
  UNIQUE INDEX `iduser_UNIQUE` (`IDuser` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `notesDB`.`languages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `notesDB`.`languages` ;

CREATE TABLE IF NOT EXISTS `notesDB`.`languages` (
  `IDlanguages` SMALLINT UNSIGNED NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`IDlanguages`),
  UNIQUE INDEX `IDlanguages_UNIQUE` (`IDlanguages` ASC),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `notesDB`.`versions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `notesDB`.`versions` ;

CREATE TABLE IF NOT EXISTS `notesDB`.`versions` (
  `IDversions` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `note_id` BIGINT UNSIGNED NOT NULL,
  `revision` MEDIUMINT UNSIGNED NOT NULL,
  `datetime` DATETIME NOT NULL,
  `title` VARCHAR(512) NULL,
  `filetype` VARCHAR(5) NULL,
  `content` TEXT NOT NULL,
  `description` TEXT NULL,
  `language_id` SMALLINT UNSIGNED NULL,
  `wrap_style` BINARY NOT NULL,
  `indent_style` BINARY NOT NULL,
  `indent_size` TINYINT NOT NULL,
  `is_private` BINARY NOT NULL,
  `folder` JSON NOT NULL,
  `tags` JSON NOT NULL,
  PRIMARY KEY (`IDversions`),
  UNIQUE INDEX `IDversions_UNIQUE` (`IDversions` ASC),
  FULLTEXT INDEX `find_by_content` (`content` ASC, `description` ASC, `title` ASC),
  FULLTEXT INDEX `find_by_title` (`title` ASC, `description` ASC, `content` ASC),
  INDEX `fk_versions_languages_idx` (`language_id` ASC),
  CONSTRAINT `fk_Versions_Languages`
    FOREIGN KEY (`language_id`)
    REFERENCES `notesDB`.`languages` (`IDlanguages`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `notesDB`.`notes_versions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `notesDB`.`notes_versions` ;

CREATE TABLE IF NOT EXISTS `notesDB`.`notes_versions` (
  `IDnotes_versions` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `note_id` BIGINT UNSIGNED NOT NULL,
  `latest_version_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`IDnotes_versions`),
  UNIQUE INDEX `IDnotes_versions_UNIQUE` (`IDnotes_versions` ASC),
  UNIQUE INDEX `notes_id_UNIQUE` (`note_id` ASC),
  UNIQUE INDEX `latest_version_id_UNIQUE` (`latest_version_id` ASC),
  CONSTRAINT `fk_Notes_versions_Versions`
    FOREIGN KEY (`latest_version_id`)
    REFERENCES `notesDB`.`versions` (`IDversions`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `notesDB`.`users_notes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `notesDB`.`users_notes` ;

CREATE TABLE IF NOT EXISTS `notesDB`.`users_notes` (
  `IDusers_notes_tags` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `note_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`IDusers_notes_tags`),
  UNIQUE INDEX `IDusers_notes_tags_UNIQUE` (`IDusers_notes_tags` ASC),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  UNIQUE INDEX `note_id_UNIQUE` (`note_id` ASC),
  CONSTRAINT `fk_Users_notes_Users`
    FOREIGN KEY (`user_id`)
    REFERENCES `notesDB`.`users` (`IDuser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Users_notes_Notes_versions`
    FOREIGN KEY (`note_id`)
    REFERENCES `notesDB`.`notes_versions` (`IDnotes_versions`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `notesDB`.`comments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `notesDB`.`comments` ;

CREATE TABLE IF NOT EXISTS `notesDB`.`comments` (
  `IDcomments` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `note_id` BIGINT UNSIGNED NOT NULL,
  `datetime` DATETIME NOT NULL,
  `content` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`IDcomments`),
  UNIQUE INDEX `IDcomments_UNIQUE` (`IDcomments` ASC),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  UNIQUE INDEX `note_id_UNIQUE` (`note_id` ASC),
  CONSTRAINT `fk_Comments_Users`
    FOREIGN KEY (`user_id`)
    REFERENCES `notesDB`.`users` (`IDuser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Comments_Notes_versions`
    FOREIGN KEY (`note_id`)
    REFERENCES `notesDB`.`notes_versions` (`IDnotes_versions`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
USE `notesDB`;

DELIMITER $$

USE `notesDB`$$
DROP TRIGGER IF EXISTS `notesDB`.`versions_AFTER_INSERT` $$
USE `notesDB`$$
CREATE DEFINER = CURRENT_USER TRIGGER `notesDB`.`versions_AFTER_INSERT` AFTER INSERT ON `versions` FOR EACH ROW
BEGIN
	-- find the note_id inside `notes_versions` that the updated row belongs to
    UPDATE `notes_versions` 
		SET `latest_version_id` = revision
        WHERE `notes_versions.note_id` = `versions.note_id`;
END$$


DELIMITER ;
