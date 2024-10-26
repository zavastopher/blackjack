CREATE USER IF NOT EXISTS 'blackjackclient'@'host' IDENTIFIED BY 'blackjackpass';

CREATE DATABASE IF NOT EXISTS blackjack;

USE blackjack;

GRANT ALL PRIVILEGES ON *.* TO 'blackjackclient'@'host' IDENTIFIED BY 'blackjackpass';

CREATE TABLE IF NOT EXISTS user (
    userid          int NOT NULL AUTO_INCREMENT,
    email           varchar(70),
    username        varchar(70),
    userpassword    varchar(128),
    usersalt        varchar(70),
    score           int,
    PRIMARY KEY (userid)
);