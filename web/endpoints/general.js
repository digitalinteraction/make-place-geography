const { Router } = require('express')

/**
 * A router to add the hello world endpoint
 * @param  {SqlClient} sql An sql client to perform queries with
 * @return {express.Router}
 */
module.exports = function(sql) {
  
  let router = new Router()
  
  // ENDPOINT: general.hello
  router.get('/', (req, res) => {
    res.api.sendData('ok')
  })
  
  return router
}
