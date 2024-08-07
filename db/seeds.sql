INSERT INTO department (name)
VALUES ('Sales'),
       ('Human Resources'),
       ('IT'),
       ('The GOATS');

INSERT INTO role (title, salary, department_id)
VALUES ('manager', 50000, 1),
       ('data clerk', 30000, 3),
       ('secretary', 20000, 2),
       ('SECRET BOSS', 1000000, 4),
       ('Super Brother Man', 1000000000, 4);

       INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Zackary', 'Attwood', 5, 1),
       ('Futaba', 'Sakura', 2, 2),
       ('Jason', 'Xcade', 4, 4),
       ('Tokiko', 'Fuuma' 3, 3);