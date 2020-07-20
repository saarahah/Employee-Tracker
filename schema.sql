-- DROP DATABASE IF EXISTS tracker_DB;
-- CREATE DATABASE tracker_DB;

-- USE tracker_DB;

-- CREATE TABLE department(
-- deptname VARCHAR (30) NOT NULL,
-- id INT NOT NULL AUTO_INCREMENT,
-- PRIMARY KEY (id)
-- );

-- CREATE TABLE emprole(
-- id INT NOT NULL AUTO_INCREMENT,
-- title VARCHAR (30) NULL,
-- salary DECIMAL NULL,
-- department_id INT NULL,
-- PRIMARY KEY (id),
-- FOREIGN KEY (department_id)
-- 	references department (id)
-- );

-- CREATE TABLE employee(
-- emp_id INT NOT NULL AUTO_INCREMENT,
-- first_name VARCHAR(30) NOT NULL,
-- last_name VARCHAR(30) NOT NULL,
-- role_id INT NOT NULL,
-- manager_id INT,
-- PRIMARY KEY (emp_id),
-- FOREIGN KEY (role_id)
-- 	references emprole (id),
-- FOREIGN KEY (manager_id)
-- 	references employee (emp_id)
-- );