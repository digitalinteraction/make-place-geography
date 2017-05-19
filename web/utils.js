
const mysql = require("mysql")


class Utils {
    
    /** The current mysql pool */
    get pool() { return this._pool; }
    
    /**
     * Creates a new utils with an sql url string
     * @param  {string} sql The sql string
     */
    constructor(sql) {
        this._pool = mysql.createPool(sql)
    }
    
    
    responseJson(data, messages, success, code) {
        return {
            meta: {
                success: success,
                messages: _.isArray(messages) ? messages : [messages]
            },
            data: data
        }
    }
    apiSuccess(res, data) {
        res.send(this.responseJson(data, [], true, 200))
    }
    apiFail(res, messages, code = 400) {
        res.send(this.responseJson(null, messages, false, code))
    }
    
    /**
     * Returns an array of [message] if the condition is false
     * @param  {bool} condition The condition that should be true
     * @param  {string} message An error message if the condition is not true
     * @return {string[]}       An array of messages
     */
    guard(errors, condition, message) {
        if (!condition) errors.push(message)
    }
}


module.exports = Utils
