DROP DATABASE IF EXISTS cms_db;
CREATE DATABASE cms_db;

\c cms_db;

CREATE TABLE department ( 
    id SERIAL PRIMARY KEY
    name VARCHAR(30) UNIQUE NOT NULL 
)

CREATE TABLE role(
     id SERIAL PRIMARY KEY
    title VARCHAR(30) UNIQUE NOT NULL 
    salary DECIMAL NOT NULL
    FOREIGN KEY (department_id)
    REFERENCES department(id)
)

CREATE TABLE employee (
    id SERIAL PRIMARY KEY
    first_name VARCHAR(30) NOT NULL 
    last_name VARCHAR(30) NOT NULL 
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    manager_id INTEGER
)