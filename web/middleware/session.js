const Api = require('../Api')

module.exports = function(sql) {
  
  return Api.handleErrors(async (req, res, next) => {
    
    // Fail if theres no 'api_key' in the query parameters
    if (!req.query.api_key) {
      return res.api.sendFail(`Please provide an 'api_key'`, 401)
    }
    
    // Fetch the api_key or fail
    let keys = await sql`select * from api_key where api_key.key=${req.query.api_key}`
    if (keys.length === 0) {
      return res.api.sendFail(`Authentication Failed`, 401)
    }
    
    // Fetch the deployment or fail
    let deps = await sql`select * from deployment where deployment.id=${keys[0].deployment_id}`
    if (deps.length === 0) {
      return res.api.sendFail(`Authentication Failed`, 401)
    }
    
    // Store on the request for later use
    req.apikey = keys[0]
    req.deployment = deps[0]
    next()
  })
}
