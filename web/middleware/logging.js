const winston = require('winston')
const expressWinston = require('express-winston')


/**
 * Generates a middleware to perform logging
 * @param  {SqlClient} sql An sql client to perform queries with
 * @return {middleware[]}
 */
module.exports = function(sql) {
  return [
    
    // A file-based log for detailed information
    expressWinston.logger({
      transports: [
        new winston.transports.File({
          filename: '/app/logs/app.log'
        })
      ]
    }),
    
    // A consoloe log for a summary
    expressWinston.logger({
      meta: false,
      transports: [
        new winston.transports.Console({
          colorize: true,
          json: false
        })
      ]
    })
  ]
}
