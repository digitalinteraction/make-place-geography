const express = require('express')
const bodyParser = require('body-parser')

const Api = require('./Api')
const SqlClient = require('./SqlClient')

const makeGeoEndpoints = require('./endpoints/geo')
const makeGeneralEndpoints = require('./endpoints/general')
const makeSessionMiddleware = require('./middleware/session')
const makeLoggingMiddleware = require('./middleware/logging')

;(async () => {
  
  // Generate an SQL client to talk to the database, (connects using env vars)
  // named 'sql', so Atom's linting formats template literals as sql statements (handy!)
  const sql = new SqlClient()
  
  
  // The express app to add our routes to
  let app = express()
  
  
  // General middleware
  app.use(bodyParser.json())
  app.use(Api.middleware('MakePlace Geo', process.env.npm_package_version))
  app.use('/docs', express.static('docs'))
  app.use(makeLoggingMiddleware(sql))
  
  
  // ENDPOINT: general.hello
  app.use('/', makeGeneralEndpoints(sql))
  
  
  // Add geo endpoints and verify with session middleware
  app.use('/geo', makeSessionMiddleware(sql), makeGeoEndpoints(sql))
  
  
  // Start the app up
  app.listen(3000)
  console.log('Listening on http://localhost:3000')
  
})()
