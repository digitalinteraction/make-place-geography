
/**
 * A utility to handle common api-like tasks, e.g. send formatted json
 * responses or catching errors and reporting them in a standard way.
 * @type {[type]}
 */
module.exports = class Api {
  
  /** Generates middleware to add an api to the request & response for later use */
  static middleware(name, version) {
    return (req, res, next) => {
      let api = new this(req, res, name, version)
      req.api = api
      res.api = api
      next()
    }
  }
  
  /** Generates a middleware / request which will catch errors and report them using #sendFail */
  static handleErrors(block) {
    
    // If passed 2 args to the block, don't use the next param
    if (block.length === 2) {
      return async function(req, res) {
        try {
          await block(req, res)
        }
        catch (error) {
          res.api.sendFail(error.message)
        }
      }
    }
    else {
      return async function(req, res, next) {
        try {
          await block(req, res, next)
        }
        catch (error) {
          res.api.sendFail(error.message)
        }
      }
    }
  }
  
  /** Creates an new Api instance to handle a request and send api responses */
  constructor(req, res, name = null, version = null) {
    this.req = req
    this.res = res
    this.name = name
    this.version = version
  }
  
  /** Generates a meta block for an api response */
  makeMetaBlock(isSuccessful, messages, status) {
    return {
      success: isSuccessful,
      messages: Array.isArray(messages) ? messages : [messages],
      name: this.name || undefined,
      version: this.version || undefined
    }
  }
  
  /** Generates a failed api response with a set of errors and a gttp code to set */
  sendFail(messages, status = 400) {
    this.res.status(status).send({
      meta: this.makeMetaBlock(false, messages, status),
      data: null
    })
  }
  
  /** Generates a successful api response with data payload and optional http code to set */
  sendData(data, status = 200) {
    this.res.status(status).send({
      meta: this.makeMetaBlock(true, [], status),
      data: data
    })
  }
}
