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


var prompt = function (question){

    return inquirer.prompt(question)

    .then(function(answers){

        switch(answers.options){

            case "view all employees":
        
            break;

            case: "view all departments":

            break;
            
            case "add a new employee":

            break;

            case "add a new role":
            
            break;

            case "update role":

            break;

        

        }
    })
}




const initialQ = {
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

prompt(initialQ);