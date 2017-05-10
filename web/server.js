
global._ = require("lodash")
global.express = require("express")
global.mysql = require("mysql")

const bodyParser = require("body-parser")

const Utils = require("./utils")
const geo = require('./geo')


let sqlUrl = process.env.SQL_URL ||  `mysql://${process.env.SQL_USER}:${process.env.SQL_PASS}@${process.env.SQL_HOST}/${process.env.SQL_NAME}`;
let utils = new Utils(sqlUrl)


global.sql = function(string, ...values) {
    
    let index = 0
    let queryString = ''
    
    while (index < values.length) {
        queryString += string[index]
        queryString += mysql.escape(values[index])
        index++
    }
    
    queryString += string[index]
    
    return new Promise(function(resolve, reject) {
        
        utils.pool.query(queryString, function(error, values) {
            if (error) { reject(error) }
            else { resolve(values) }
        })
    })
}





console.log("- Starting server")
let app = express()

app.use(bodyParser.json())


// Hello world endpoint
app.get("/", (req, res) => {
    utils.apiSuccess(res, { version: "0.0.1", message: "MakePlace geo api" })
})


// Apidoc routes
app.use("/docs", express.static("docs"))

// If in dev mode add coverage routes
if (process.env.NODE_ENV === "dev") {
    app.use("/coverage", express.static("coverage"))
}



// Authentication
app.use((req, res, next) => {
    
    if (!req.query.api_key) {
        return utils.apiFail(res, "Please provide an 'api_key'", 401)
    }
    
    
    sql `select * from deployment where api_key=${req.query.api_key}`
    .then(values => {
        
        if (values.length === 0) {
            return utils.apiFail(res, "Authentication Failed", 401)
        }
        
        req.deployment = values[0];
        next();
    })
    .catch(error => {
        utils.apiFail(res, "Failed to connect to database")
    })
    
})







// Add the geo endpoints
app.use("/geo", geo(utils))



// Start express
const port = process.env.API_PORT || 3000
app.listen(port)
console.log("- Setup on http://localhost:" + port)
