const mysql = require('mysql')

module.exports = function(sqlUri = null) {
  
  sqlUri = sqlUri || module.exports.uriFromEnv()
  
  let pool = mysql.createPool(sqlUri)
  
  return function(string, ...values) {
    
    let index = 0
    let queryString = ''
    
    while (index < values.length) {
      queryString += string[index]
      queryString += mysql.escape(values[index])
      index++
    }
    
    queryString += string[index]
    
    return new Promise(function(resolve, reject) {
      pool.query(queryString, function(error, values) {
        if (error) { reject(error) }
        else { resolve(values) }
      })
    })
  }
}

module.exports.uriFromEnv = function() {
  return process.env.SQL_URL ||
    `mysql://${process.env.SQL_USER}:${process.env.SQL_PASS}@${process.env.SQL_HOST}/${process.env.SQL_NAME}`
}
