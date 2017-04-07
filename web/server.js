"use strict"


global._ = require("lodash")
global.express = require("express")
global.mysql = require("mysql")

const Utils = require("./utils")
const geo = require('./geo')



global.sql = function(string, ...values) {
    
    let index = 0
    let query = ''
    
    while (index < values.length) {
        query += string[index]
        query += mysql.escape(values[index])
        index++
    }
    
    query += string[index]
    return query
}





console.log("- Starting server")
let app = express()
let utils = new Utils(process.env.SQL_URL)

let pool = mysql.createPool(process.env.SQL_URL)

// console.log(process.env.NODE_ENV);
// console.log(process.env.DB_URL);



// Hello world endpoint
app.get("/", (req, res) => {
    utils.apiSuccess(res, { version: "0.0.1", message: "MakePlace geo api" })
})


// Apidoc routes
app.use("/docs", express.static("docs"))



app.use((req, res, next) => {
    
    let key = req.query.api_key
    
    if (!key) {
        utils.apiFail(res, "Please provide an 'api_key'", 401)
        return
    }
    
    
    // TODO: Sanitise apikey
    
    
    utils.pool.query(`SELECT * FROM deployment WHERE api_key='${key}'`, (error, values) => {
        
        if (error) { return utils.apiFail(res, "Failed to connect to database") }
        
        if (values.length === 0) {
            return utils.apiFail(res, "Authentication Failed", 401)
        }
        
        req.deployment = values[0];
        next();
    })
})

let tmp = "World"
let name = "Methos"
console.log(sql `Hello ${tmp}! My name is ${name}.${";DROP TABLE USERS;"}`)



// If in dev mode add coverage routes
if (process.env.NODE_ENV === "dev") {
    app.use("/coverage", express.static("coverage"))
}



// Add the geo endpoints
app.use("/geo", geo(utils))



// Start express
app.listen(3000)
console.log("- Setup on http://localhost:3000")
