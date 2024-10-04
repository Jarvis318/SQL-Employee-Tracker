const inquirer = require('inquirer');
const express = require('express');

const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();


// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Where we connect to a new database.
const pool = new Pool(
    {
        // TODO: Upon downloading program, user will need to enter their PostgreSQL username as password below:
        user: 'postgres',
        password: 'postgres',
        host: 'localhost',
        database: 'cms_db'
    },
    console.log(`Connected to the cms_db database.`)
)

pool.connect();


//For prompting the user on what they would like to do:

function init() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "choice",
                choices: ["Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "View All Employees"]
            }
        ])
        .then((response) => {
            if (response.choice === 'View All Employees') {
                pool.query('SELECT * FROM EMPLOYEE ORDER BY id', function (err, res) { console.table(res.rows); init() })
            } else if (response.choice === 'View All Roles') {
                pool.query('SELECT * FROM ROLE', function (err, res) { console.table(res.rows); init() })
            } else if (response.choice === "Add Employee") {
                inquirer
                    .prompt([{
                        message: "What is your first name?",
                        name: "firstName"
                    },
                    {
                        message: "What is your last name?",
                        name: "lastName"

                    }
                    ])
                    .then((response) => {
                        const insertQuery = 'INSERT INTO employee (first_Name, last_Name, role_id, manager_id) VALUES ($1, $2, $3, $4)';

                        pool.query(insertQuery, [response.firstName, response.lastName, 1, null], function (err, res) {
                            if (err) {
                                console.log("Employee not updated.", err)
                            }
                            else {
                                console.log("Employee Added!")
                                init()
                            }
                        })
                    })


            } else if (response.choice === "Update Employee Role") {
                async function getEmployees() {
                    let employees = await pool.query('SELECT * FROM employee')
                    return employees;
                }
                async function getRoles() {
                    let roles = await pool.query('SELECT * FROM role')
                    return roles;
                }
                let formatedEmployees = []
                let formatedRoles = []
                getEmployees()
                    .then(res => {
                        let employeesArray = res.rows
                        employeesArray.forEach(employee => {
                            let formatedEmployee = {
                                name: employee.first_name + ' ' + employee.last_name,
                                value: employee.id
                            }
                            formatedEmployees.push(formatedEmployee) //Pushes each employee object to an array.
                        })
                        getRoles()
                            .then(ans => {
                                let rolesArray = ans.rows
                                rolesArray.forEach(role => {
                                    let formatedRole = {
                                        name: role.title,
                                        value: role.id
                                    }
                                    formatedRoles.push(formatedRole)
                                })
                            })

                        inquirer
                            .prompt([{
                                type: "list",
                                message: "Select the employee you would like to update",
                                name: "chosenEmployee",
                                choices: formatedEmployees //Searches the database based on the id. You're choosing the user name, but the id is what is returned.
                            },
                            {
                                type: "list",
                                message: "Choose the role you'd like this employee to have:",
                                name: "employeeRole",
                                choices: formatedRoles // Searches the database based on the id of the role. Shows the name of the role to the user, but returns the role id to the server.
                            }
                            ])
                            .then((response) => {
                               // let oldRoleId = res.rows[response.chosenEmployee -1].role_id; //gets the old Role Id of the employee.
                                const updateQuery = `UPDATE employee SET role_id = $1 WHERE id = $2`
                                console.log(response)
                                const params = [response.employeeRole, response.chosenEmployee];
                                pool.query(updateQuery, params, function (err, result) {
                                    if (err) {
                                        console.log("Employee not updated.", err)
                                    }
                                    else {
                                        console.log("Employee updated!")
                                        init()
                                    }
                                })
                            })
                    })

            } else if (response.choice === "View All Departments") {
                pool.query('SELECT * FROM department', function (err, res) { console.table(res.rows); init() })
            } else if (response.choice === "Add Department") {
                inquirer
                    .prompt({
                        message: "Please provide a unique department name:",
                        name: "deptName"
                    }
                    )
                    .then((response) => {
                        const insertQuery = 'INSERT INTO department (department_name) VALUES ($1)';

                        pool.query(insertQuery, [response.deptName], function (err, res) {
                            if (err) {
                                console.log("Department not updated.", err)
                            }
                            else {
                                console.log("Department Added!")
                                init()
                            }
                        })
                    })

            } else if (response.choice === "Add Role") {
                async function getDept() {
                    let dept = await pool.query('SELECT * FROM department')
                    return dept;
                }
                let formatedDepartments = []
                getDept()
                    .then(ans => {
                        let deptartmentsArray = ans.rows
                        deptartmentsArray.forEach(dept => {
                            let formatedDepartment = {
                                name: dept.department_name,
                                value: dept.id
                            }
                            formatedDepartments.push(formatedDepartment) //Pushes each Department object to an array.
                        })
                    })
                inquirer
                    .prompt([{
                        message: "Please provide a unique role name:",
                        name: "roleName"
                    },
                    {
                        message: "Please provide a salary:",
                        name: "salary"

                    },{
                        meassage: "Please choose a department:",
                        name: "dept",
                        type: "list",
                        choices: formatedDepartments

                    }
                    ])
                    .then((response) => {
                        const insertQuery = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';

                        pool.query(insertQuery, [response.roleName, response.salary, response.dept], function (err, res) {
                            if (err) {
                                console.log("Role not updated.", err)
                            }
                            else {
                                console.log("Role Added!")
                                init()
                            }
                        })
                    })
                
            }
        })
}

init();