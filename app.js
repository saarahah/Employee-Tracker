var mysql = require("mysql");
var inquirer = require("inquirer");
const { RSA_PKCS1_OAEP_PADDING } = require("constants");
const { connect } = require("http2");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "tracker_DB",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

//begin with initial Qs
function start() {
  inquirer
    .prompt({
      type: "list",
      name: "options",
      message: "what do you want to do?",
      choices: [
        "view all employees",
        "view employee by manager",
        "view all departments",
        "view all roles",
        "add a new employee",
        "add a new role",
        "add a new department",
        "update role",
        "update manager",
        "exit",
      ],
    })
//use switch to determine which functions run for which options
    .then(function (answers) {
      switch (answers.options) {
        case "view all employees":
          viewAllEmp();

          break;

          case "view employee by manager":
            viewByManage();
  
            break;

        case "add a new department":
          addDept();

          break;

        case "view all roles":
          viewRole();

          break;

        case "add a new employee":
          addEmployee();

          break;

        case "add a new role":
          addRole();

          break;

        case "view all departments":
          viewAllDept();

          break;

        case "update role":
          updateRole();

          break;

        case "update manager":

          updateManager();

          break;

        case "exit":
          exit();

          break;
      }
    });
}
//add an employee
function addEmployee() {
  connection.query("SELECT * FROM emprole", function (err, results) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "what is the employee first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "what is the employee last name?",
        },

        {
          type: "list",
          name: "role_id",
          message: "employee's role?",
          choices: function () {
//create an array for the employee
            var empArray = [];
            for (i = 0; i < results.length; i++) {
              empArray.push(results[i].title);
            }
            return empArray;
          },
        },
      ])
//create a variable for the role id
      .then(function (answer) {
        var emproleID;
        for (j = 0; j < results.length; j++) {
          if (results[j].title === answer.role_id) {
            emproleID = results[j].id;
          }
        }

        connection.query(
          "INSERT INTO employee SET ?",
          {
//insert the data into the table
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: emproleID,
            //   manager_id : answer.manager_id
          },
          function (err) {
            if (err) throw err;
            console.log("employee added!");
            back();
          }
        );
      });
  });
}

function viewAllDept() {
//select the dept info
  connection.query("SELECT * FROM department", function (error, results) {
    if (error) throw error;
    console.table(results);
    back();
  });
}

function viewByManage(){
connection.query("SELECT employee.emp_id, employee.first_name, employee.last_name, CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON manager.emp_id = employee.manager_id;",
function (error, results) {
  if (error) throw error;
  console.table(results)
  back();
});
}

function viewAllEmp() {
  connection.query(

//select info that shows all employee info
    "SELECT employee.emp_id, employee.first_name, employee.last_name, emprole.title, department.deptname AS department, emprole.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN emprole on employee.role_id = emprole.id LEFT JOIN department on emprole.department_id = department.id LEFT JOIN employee manager on manager.emp_id = employee.manager_id;",
    
    function (error, results) {
      if (error) throw error;
//show results in table
      console.table(results);
      back();
    }
  );
}

function viewRole() {
  connection.query(
//select all role info
    "SELECT emprole.id, emprole.title, department.deptname AS department, emprole.salary FROM emprole LEFT JOIN department on emprole.department_id = department.id;",
    function (error, results) {
      if (error) throw error;
//show results in table
      console.table(results);
      back();
    }
  );
}

function addDept() {
//ask department insert Qs
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "what department would you like to add?",
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          deptname: answer.department,
        },
        function (err) {
          if (err) throw err;
          console.log("department added!");
          back();
        }
      );
    });
}
//add a role
function addRole() {
//create an array for roles
    var depts = [];
//select from emprole and dept tables
    connection.query("SELECT * FROM emprole, department", function (err, results) {
        for (i = 0; i < results.length; i++) {
//use a for loop to fill array with dept id and dept name
          var dept = results[i].id + " " + results[i].deptname;
//push into array
          depts.push(dept);
        }
      });
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "what role would you like to add?",
      },
     {
        type: "input",
        name: "salary",
        message: "what is the salary?",
      },
      {
        name: "dept",
        type: "list",
        message: "select a department?",
        choices: depts,
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO emprole SET ?",
        {
//set the values in the table emprole 
          title: answer.role,
            salary: answer.salary,
//use the dept id to set the dept
            department_id: parseInt(answer.dept)
        },

        function (err) {
          if (err) throw err;
          console.log("role added!");
          back();
        }
      );
    });
}

function updateRole() {
//create array for roles to be pushed in
  var roles = []
//select all from emprole
  connection.query("SELECT * FROM emprole", function (err, results) {
//push roles and ids
    for (j = 0; j < results.length; j++) {
      var role = results[j].id + " " + results[j].title;
      roles.push(role);
    }
  });
  var employees = [];
  //select for employee and push into array just like roles
  connection.query(
    "SELECT employee.*, emprole.title FROM employee JOIN emprole ON employee.role_id = emprole.id ORDER BY emp_id",
    function (err, results) {
      for (i = 0; i < results.length; i++) {
        var employee =
          results[i].emp_id +
          " " +
          results[i].first_name +
          " " +
          results[i].last_name;
        employees.push(employee);
      }

      inquirer
        .prompt([
          {
            name: "emp_id",
            type: "list",
            message: "select an employee ID number",
            choices: employees,
          },
          {
            name: "role_id",
            type: "list",
            message: "select a role ID number?",
            choices: roles,
          },
        ])
        .then(function (answer) {
          connection.query("UPDATE employee SET ? WHERE ?", [
            {
//use the parsed id value to update table
              role_id: parseInt(answer.role_id),
            },
            {
              emp_id: parseInt(answer.emp_id),
            },

            function (err, data) {
              if (err) {
                throw err;
              }
            },
          ]);

          back();
        });
    }
  );
}

function updateManager() {
  var employees = [];

  connection.query("SELECT * FROM employee", function (err, results) {
    for (i = 0; i < results.length; i++) {
      var employee =
        results[i].emp_id +
        " " +
        results[i].first_name +
        " " +
        results[i].last_name;
      employees.push(employee);
    }

    inquirer
      .prompt([
        {
          name: "emp_id",
          type: "list",
          message: "select an employee?",
          choices: employees,
        },
        {
          name: "manager_id",
          type: "list",
          message: "select a manager?",
          choices: employees,
        },
      ])
      .then(function (answer) {
        connection.query("UPDATE employee SET ? WHERE ?", [
          {
            manager_id: parseInt(answer.manager_id),
          },
          {
            emp_id: parseInt(answer.emp_id),
          },

          function (err, data) {
            if (err) {
              throw err;
            }
          },
        ]);

        back();
      });
  });
}
//back function so user can return to main menu without seeing all q's again
function back() {
  inquirer
    .prompt({
      type: "list",
      name: "back",
      choices: ["back"],
    })
    .then(function (answer) {
      if (answer.back === "back") {
        start();
      }
    });
}

function exit() {
  connection.end();
}
