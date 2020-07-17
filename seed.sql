INSERT INTO department (deptname)
VALUES ("Graphic Design"),
("3D Art"),
("Character Art"),
("Management");

INSERT INTO emprole (title, salary, department_id)
VALUES ("Lead Designer", 43242, 1),
("Junior Designer", 42, 1),
("3D Modeler", 32343, 2),
("Lead Artist", 434343, 3),
("Junior Artist", 32, 3),
("Manager", 4389043, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Kathy", "Drumm", 6, NULL),
("Dan", "Howard", 6, 1),
("Cody", "Reynolds", 6, 1),
("Doug", "Strayer", 6, 1),
("Quynh", "Kimball", 1, 4),
("Mark", "McIntye", 3, 1),
("Derek", "Lesinski", 3, 6),
("Richard", "Terpstra", 1, 2),
("Travis", "Carter", 2, 4),
("Brian", "Blackmore", 4, 3),
("Casey", "Jones", 4, 3),
("Matt", "DeWater", 5, 3),
("Corrine", "Cook", 3, 6),
("Kenneth", "Tryal", 5, 3)