const mysql = require('mysql')

/**
 * Generates an sql client for use with the ES6 Templating queries
 * @param  {String} [sqlUri=null] [description]
 * @return {Sql}
 */
module.exports = function(sqlUri = null) {
  
  // Generate an sql uri from the environment if not passed one
  sqlUri = sqlUri || module.exports.uriFromEnv()
  
  
  // Create an sql pool to perform queries on
  let pool = mysql.createPool(sqlUri)
  
  
  // Return the ES6 Template handler
  return function(string, ...values) {
    
    let index = 0
    let queryString = ''
    
    // Loop through the string and values together, generating an escaped SQL query
    while (index < values.length) {
      queryString += string[index]
      queryString += mysql.escape(values[index])
      index++
    }
    
    // Add the last bit of the string (theres always one extra string)
    queryString += string[index]
    
    // Return a promise to execute the sql query
    return new Promise(function(resolve, reject) {
      pool.query(queryString, function(error, values) {
        if (error) { reject(error) }
        else { resolve(values) }
      })
    })
  }
}

/**
 * A utility to generate an sql URI from environment variables.
 * It first tries SQL_URL and falls back to constructing from the base parts
 * @return {string}
 */
module.exports.uriFromEnv = function() {
  return process.env.SQL_URL ||
    `mysql://${process.env.SQL_USER}:${process.env.SQL_PASS}@${process.env.SQL_HOST}/${process.env.SQL_NAME}`
}
