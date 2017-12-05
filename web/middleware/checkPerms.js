
/**
 * Generates a middleware to check a permission code on a request and
 * will only continue if the check passes
 * @param  {...String} codes [description]
 * @return {[type]}       [description]
 */
module.exports = function checkPerms(...codes) {
  return async (req, res, next) => {
    if (codes.includes(req.apikey.type) || req.apikey.type === 'ALL') {
      next()
    }
    else {
      res.api.sendFail(`You can't do that`, 401)
    }
  }
}
