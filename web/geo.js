"use strict"



module.exports = function(utils) {
    
    let router = new express.Router()
    
    
    
    router.get("/", (req, res) => {
        
        let select = `SELECT * FROM geo_data WHERE deployment_id=${utils.escape(req.deployment.id)}`
        
        utils.pool.query(select, (error, values, fields) => {
            
            if (error) { return utils.apiFail(res, error) }
            
            utils.apiSuccess(res, values)
        })
    })

    router.get("/:id", (req, res) => [
        utils.apiSuccess(res, { message: `Geo get: ${req.params.id}` })
    ])

    router.post("/", (req, res) => {
        utils.apiSuccess(res, { message: "Geo submit" })
    })
    
    
    return router
}
