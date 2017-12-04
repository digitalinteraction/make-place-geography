const { Router } = require('express')

module.exports = function(sql) {
  
  let router = new Router()
  
  
  // ENDPOINT: general.hello
  router.get('/', (req, res) => {
    res.api.sendData('ok')
  })
  
  
  return router
}
