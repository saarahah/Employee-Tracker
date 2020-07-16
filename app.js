var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "tracker_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});


function start (){

    inquirer.prompt(
        {

            type: "list",
            name: "options",
            message: "what do you want to do?",
            choices:[
                "view all employees",
                "view all departments",
                "add a new employee",
                "add a new role",
                "update role",
                "exit"
            ]
        }
    )

    .then(function(answers){

        switch(answers.options){

            case "view all employees":

            viewAllEmp();
        
            break;

            case "view all departments":

            viewAllDept();

            break;
            
            case "add a new employee":

            addEmployee();

            break;

            case "add a new role":

            addRole();
            
            break;

            case "update role":

            updateRole();

            break;

            case "exit":

                exit();
    
                break;        

        }
    })
    
}

function addEmployee(){

    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "what is the employee first name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "what is the employee last name?"
        },

        {
            type: "input",
            name: "role_id",
            message: "employee's role ID?"
        },
        {
            type: "input",
            name: "manager_id",
            message: "what is employee's manager ID"
        },
    ])
    .then (function(answer){

        connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name : answer.first_name,
              last_name: answer.last_name,
              role_id: answer.role_id,  
              manager_id : answer.manager_id
            },
            function(err){
                if (err) throw err;
                console.log("employee added!");
                back(); 
            }
        )      
    })
}

function viewAllDept(){

    connection.query("SELECT * FROM department", function (error, results){
        if(error) throw error;
        console.table(results);
        back();
    })

}

function viewAllEmp(){
connection.query("SELECT * FROM employee", function (error, results){
    if (error) throw error
    console.table(results)
    back();
})

}

function viewRole(){
    
}

function addRole(){

}

function addDept(){

}

function updateRole(){

}

function back(){
    inquirer.prompt({
        
            type: "list",
            name: "back",
            choices: ["back"]
        
}).then(function(answer) {

    if (answer.back === "back"){
        start();
}    
})
}

function exit(){
 connection.end()
}
