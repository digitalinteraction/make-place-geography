"use strict";




class Utils {
    
    get pool() { return this._pool; }
    
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
}


module.exports = Utils
