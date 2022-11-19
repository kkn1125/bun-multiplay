-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema multiplay
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema multiplay
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `multiplay` DEFAULT CHARACTER SET utf8 ;
USE `multiplay` ;

-- -----------------------------------------------------
-- Table `multiplay`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `multiplay`.`user` (
  `id` INT NOT NULL,
  `nickname` VARCHAR(200) NULL,
  `server` INT NULL,
  `space` VARCHAR(100) NULL,
  `pox` FLOAT NULL DEFAULT 0,
  `poy` FLOAT NULL DEFAULT 0,
  `poz` FLOAT NULL DEFAULT 0,
  `roy` FLOAT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;