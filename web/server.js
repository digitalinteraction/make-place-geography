"use strict";


global._ = require("lodash")
global.express = require("express")





console.log("- Starting server")
let app = express()



app.get("/app", (req, res) => {
    
    res.send("Hello, World!")
})


app.listen(3000)
