const express = require('express')
const bodyParser = require('body-parser')

const Api = require('./Api')
const Sql = require('./Sql')

const makeGeoEndpoints = require('./endpoints/geo')
const makeGeneralEndpoints = require('./endpoints/general')
const makeSessionMiddleware = require('./middleware/session')

;(async () => {
  
  let app = express()
  
  const sql = new Sql()
  
  
  // General middleware
  app.use(bodyParser.json())
  app.use(Api.middleware('MakePlace Geo', process.env.npm_package_version))
  
  
  // ENDPOINT: general.hello
  app.use('/', makeGeneralEndpoints(sql))
  
  
  // Add geo endpoints and verify with session middleware
  app.use('/geo', makeSessionMiddleware(sql), makeGeoEndpoints(sql))
  
  
  app.listen(3000)
  console.log('Listening on http://localhost:3000')
    
})()
