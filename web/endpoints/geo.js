const { Router } = require('express')
const Api = require('../Api')
const checkPerms = require('../middleware/checkPerms')

// The geometries that can be created
const allowedGeometries = [ 'POINT', 'LINESTRING' ]

/** Utility to push an error if a condition is truthy, for improved readability */
function pushErrorIf(errors, condition, message) {
  if (condition) { errors.push(message) }
}

/**
 * Creates an Express.Router with the geometry endpoints added to it
 * @param  {SqlClient} sql An sql instance to perform queries with
 * @return {express.Router}
 */
module.exports = function(sql) {
  
  let router = new Router()
  
  
  // ENDPOINT: geo.index
  router.get('/', checkPerms('READ'), Api.handleErrors(async (req, res) => {
    
    // Send the result of the query, errors are caught by Api
    res.api.sendData(await sql`
      select *, ST_GeometryType(geom) as 'type' from geo_data
      where deployment_id=${req.deployment.id}
    `)
  }))
  
  
  // ENDPOINT: geo.show
  router.get('/:id', checkPerms('READ'), Api.handleErrors(async (req, res) => {
    
    // Try to find the geometry
    let result = await sql`
      select *, ST_GeometryType(geom) as 'type' from geo_data
      where deployment_id=${req.deployment.id} and id=${req.params.id}`
    
    // Return the first result, or a 404 if not found
    if (result.length === 0) {
      res.api.sendFail(`geo_data '${req.params.id}' not found`, 404)
    }
    else {
      res.api.sendData(result[0])
    }
  }))
  
  
  // ENDPOINT: geo.create
  router.post('/', checkPerms('WRITE'), Api.handleErrors(async (req, res) => {
    
    // Check the data_type and geom were passed
    let errors = []
    pushErrorIf(errors, typeof req.body.data_type !== 'number', `Please provide a 'data_type'`)
    pushErrorIf(errors, typeof req.body.geom !== 'object', `Please provide 'geom' as an object`)
    
    
    // Fail now if there were any errors
    if (errors.length > 0) { return req.api.sendFail(errors) }
    
    
    // Get validated values from the request
    let geom = req.body.geom
    let dataType = req.body.data_type
    let geomString = ''
    
    
    // Check a valid geometry type was passed
    // NOTE: There has to be at least 2 points as mysql won't store a single point in a string
    pushErrorIf(errors, !geom.type || !allowedGeometries.includes(geom.type),
      `Please provide a valid 'geom.type'`
    )
    
    
    // Validate & parse point type geometries
    if (geom.type === 'POINT') {
      pushErrorIf(errors, !geom.x || !geom.y, `Point needs an an 'x' & 'y'`)
      geomString = `POINT(${geom.x} ${geom.y})`
    }
    else if (geom.type === 'LINESTRING') {
      
      // Validate & parse linestring type geometries
      
      // Check the geom is an array with at least 2 points
      pushErrorIf(errors, !Array.isArray(geom.points) && geom.points.length > 1,
        `Please provide an array of points for your LINESTRING`
      )
      
      if (errors.length === 0) {
        
        // Loop each point, checking it is a valid point
        let pointStrings = geom.points.map((point, i) => {
          pushErrorIf(errors, !point.x || !point.y, `geom.points[${i}] needs an 'x' and 'y'`)
          return `${point.x} ${point.y}`
        })
        
        geomString = `LINESTRING(${pointStrings.join(',')})`
      }
    }
    
    
    // More types ?
    // ...
    
    
    // If there were any errors, stop here
    if (errors.length) return req.api.sendFail(errors)
    
    
    // Create the record
    let record = await sql`
      insert into geo_data (geom, deployment_id, data_type_id, api_key_id) values(
        ST_GeomFromText(${geomString}), ${req.deployment.id}, ${dataType}, ${req.apikey.id}
      )`
    
    
    // Send the id back
    res.api.sendData(record.insertId)
  }))
  
  
  return router
}
