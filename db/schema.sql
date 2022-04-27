CREATE DATABASE  IF NOT EXISTS TaskManagement;

USE TaskManagement;
CREATE TABLE IF NOT EXISTS Task(id int  AUTO_INCREMENT,title varchar(200) not null,status enum('active','complete')  not null,primary key (id)) ;


INSERT INTO Task(title,status) values('nestjs','active')