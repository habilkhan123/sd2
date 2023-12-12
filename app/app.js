// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');


// TASK 1 start from here ' Habil Khan 
app.get("/all-students", function(req, res) {
    var sql = 'select * from Students';
    // as we are not inside async function 
    // so we will use .then function to insure that we wait 
    db.query(sql).then(results => {
        console.log(results);
        res.json(results);
    });
});


// TASK 2 Display formatted list of all students
app.get("/all-students-formatted", function(req, res) {
    var sql = 'select * from Students';
    // as we are not inside async function 
    // so we will use .then function to insure that we wait 
    var output = '<table-border="1px">';
    db.query(sql).then(results => {
        for (var row of results) {
            output += '<tr>';
            output += '<td>' + row.id + '</td>';
            output += '<td>' + '<a href="./single-student/' + row.id + '">' + row.name + '</a>' + '</td>'
            output += '</tr>'
        }
        output+= '</table>';
        res.send(output);
    
    });
});

app.get("/single-student/:id", function(req, res){
    var stId = req.params.id;
    console.log(stId);
    var stSql = "SELECT s.name as student, ps.name as programme, \
    ps.id as pcode from students s \
    JOIN student_programme sp on sp.id = s.id \
    JOIN programmes ps on ps.id = sp.programme \
    WHERE s.id = ?";
    db.query(stSql, [stId]).then(results => {
        console.log(results);
        var pCode = results[0].pcode;
        output = '';
        output += '<div><b>Student: </b>' + results[0].student + '</div>';
        output += '<div><b>Programme: </b> ' + results[0].programme + '</div>';

        // Now we call the database for module
        db.query(moSql, [pCode]).then(results => {
            console.log(results);
            res.send(output);
        });
        
    });
});



// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});