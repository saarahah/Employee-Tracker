var mysql = require("mysql");
var inquirer = require("inquirer");
const { RSA_PKCS1_OAEP_PADDING } = require("constants");

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
                "view all roles",
                "add a new employee",
                "add a new role",
                "add a new department",
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

            case "view all roles":

            viewRole();
    
            break;
            
            case "add a new employee":

            addEmployee();

            break;

            case "add a new role":

            addRole();
            
            break;

            case "add a new department":

            addDept();
                
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

connection.query("SELECT * FROM emprole", function (err, results){

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
            type: "list",
            name: "role_id",
            message: "employee's role?",
            choices: function(){

                var empArray=[];
                for (i= 0; i< results.length; i++){
                    empArray.push(results[i].title);
                }
                // console.log(empArray);
                return empArray;
            }
        },
    ])
    .then (function(answer){

        var emproleID;
        for(j= 0; j< results.length; j++){
            if (results[j].title === answer.role_id){
                emproleID = results[j].id;
            }
        }

        connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name : answer.first_name,
              last_name: answer.last_name,
              role_id: emproleID,  
              manager_id : answer.manager_id
            },
            function(err){
                if (err) throw err;
                console.log("employee added!");
                back(); 
            }
        )      
    })
})
}

function viewAllDept(){

    connection.query("SELECT department.id, department.deptname, SUM(emprole.salary) AS utilized_budget FROM employee LEFT JOIN emprole on employee.role_id = emprole.id LEFT JOIN department on emprole.department_id = department.id GROUP BY department.id, department.deptname;", function (error, results){
        if(error) throw error;
        console.table(results);
        back();
    })
}

function viewAllEmp(){
connection.query("SELECT employee.id, employee.first_name, employee.last_name, emprole.title, emprole.salary from tracker_DB.employee LEFT JOIN emprole ON emprole.id = employee.role_id", function (error, results){
    if (error) throw error
    console.table(results)
    back();
})

}

function viewRole(){
    connection.query("SELECT * FROM emprole", function (error, results){
        if (error) throw error
        console.table(results)
        back();
    })   
    }

function addDept(){

}

 function updateRole(){

    var employees= [];
    connection.query ("SELECT * FROM employee", function(err, results){
    
    for (i=0; i < results.length; i++){
        var employee=  results[i].first_name + " " + results[i].last_name;
        console.log(employee);
        employees.push(employee);
    }
    const employeeUp =  inquirer.prompt([
        {
        name: "update",
        type: "list",
        message: "select travis please give him a bonus",
        choices: employees
        
    },
    {
        name: "role_id",
        type: "list",
        message: "what do you want the new role to be?",
        choices: ["Lead Designer", "Junior Designer", "3D Modeler", "Lead Artist", "Junior Artist", "Manager"]
    }
    
]).then (function(answer){
    connection.query("UPDATE employee SET ? WHERE ?", 
    [
        {
    
             role_id: employeeUp.role_id,
        },
        {
        
             id: 0
        }
        
    ],
    )
   
})


    })
    back();
    // .then(
        
    //     connection.query ("SELECT * FROM emprole", function(err, results){
            
    //         var roleArray = [];

    //         for (i=0; i < results.length; i++){
    //             var role=  results[i].title;
    //             console.log(role);
    //             employees.push(role);
    //         }
    // inquirer.prompt([
    //             {
    //             name: "roleUpdate",
    //             type: "list",
    //             message: "select a new role",
    //             choices: roleArray
                
    //         }
    //         // {
    //         //     name: "role",
    //         //     type: "list",
    //         //     message: "what do you want the new role to be?",
    //         //     choices: ["Lead Designer", "Junior Designer", "3D Modeler", "Lead Artist", "Junior Artist", "Manager"]
    //         // }
    //     ])
    //     }
    // )
    // )
}

// ]).then (inquirer.prompt(
//     {
//         name: "role",
//         type: "list",
//         message: "select role",
//         choices: function(){

//             var empArray=[];
//             for (i= 0; i< results.length; i++){
//                 empArray.push(results[i].title);
//             }
//             // console.log(empArray);
//             return empArray;
//         }
//     })
// .then (function(answer){
//     connection.query("SELECT * FROM emprole", function (err, results){

//     var emproleID;
//     for(j= 0; j< results.length; j++){
//         if (results[j].title === answer.role_id){
//             emproleID = results[j].id;

//     }
// }
// })
//     })
// })
// }




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
