DROP DATABASE IF EXISTS tracker_DB;
CREATE DATABASE tracker_DB;

USE tracker_DB;

CREATE TABLE department(

deptname VARCHAR (30) NOT NULL,
id INT NOT NULL AUTO_INCREMENT,
PRIMARY KEY (id)
);

CREATE TABLE emprole(
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR (30) NOT NULL,
salary DECIMAL NOT NULL,
department_id INT NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (department_id)
	REFERENCES department (id)
);

CREATE TABLE employee(
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (role_id)
	REFERENCES emprole (id),
FOREIGN KEY (manager_id)
	REFERENCES employee (id)
);

