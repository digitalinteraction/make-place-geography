
module.exports = function(utils) {
    
    let router = new express.Router()
    
    let allowedGeometries = [ "POINT", "LINESTRING" ]
    
    
    /**
     * @api {get} geo/ Query for geometries
     * @apiName GeoDataIndex
     * @apiGroup Geo
     *
     * @apiDescription Perform a query for geographical data
     *
     * @apiSuccessExample {json} Success-Response:
     * {
     *   "meta": {
     *     "success": true,
     *     "messages": []
     *   },
     *   "data": [
     *     {
     *       "id": 1,
     *       "geom": {
     *         "x": 54.9791319,
     *         "y": -1.611126
     *       },
     *       "deployment_id": 1,
     *       "data_type_id": 1,
     *       "type": "POINT"
     *     }
     *   ]
     * }
     */
    router.get("/", (req, res) => {
        
        sql `select *, ST_GeometryType(geom) as 'type' from geo_data
            where deployment_id=${req.deployment.id}`
        .then(values => {
            
            utils.apiSuccess(res, values)
        })
        .catch(error => {
            
            utils.apiFail(res, error)
        })
    })
    
    
    
    
    /**
     * @api {get} geo/:id Get a geometry
     * @apiName GeoDataShow
     * @apiGroup Geo
     *
     * @apiParam {int} id The id of the data to get
     *
     * @apiDescription Get a geographical data from its id
     *
     * @apiSuccessExample {json} Success-Response:
     * {
     *   "meta": {
     *     "success": true,
     *     "messages": []
     *   },
     *   "data": {
     *     "id": 1,
     *     "geom": {
     *       "x": 54.9791319,
     *       "y": -1.611126
     *     },
     *     "deployment_id": 1,
     *     "data_type_id": 1,
     *     "type": "POINT"
     *   }
     * }
     */
    router.get("/:id", (req, res) => [
        
        sql `select *, ST_GeometryType(geom) as 'type' from geo_data
            where deployment_id=${req.deployment.id}
            and id=${req.params.id}`
        .then(values => {
            
            if (values.length === 0) {
                utils.apiFail(res, `geo_data '${req.params.id}' not found`)
            }
            else {
                utils.apiSuccess(res, values[0])
            }
        })
        .catch(error => {
            
            utils.apiFail(res, error)
        })
    ])
    
    
    
    
    /**
     * @api {post} geo Create a geometry
     * @apiName GeoDataCreate
     * @apiGroup Geo
     *
     * @apiParam {int} data_type The id of the geometry's type
     * @apiParam {Object} geom The geometry to create
     * @apiParam {String="POINT"} geom.type The type of the geometry
     * @apiParam {Number} [geom.x] The x coord of a POINT
     * @apiParam {Number} [geom.y] The y coord of a POINT
     *
     * @apiDescription Get a geographical data from its id
     *
     * @apiSuccessExample {json} Success-Response:
     * {
     *   "meta": {
     *     "success": true,
     *     "messages": []
     *   },
     *   "data": 23
     * }
     */
    router.post("/", (req, res) => {
        
        // Build errors with the request
        let errors = []
        
        
        // Check the data_type was passed
        if (!req.body.data_type) {
            errors.push(`Please provide a 'data_type'`)
        }
        
        // Check the geom was passed and is an object
        if (!_.isObject(req.body.geom)) {
            errors.push(`Please provide 'geom' as an object`)
        }
        
        
        // Fail & stop at this point if there are any errors
        if (errors.length > 0) { return utils.apiFail(res, errors) }
        
        
        // Get validated values from the request
        let geom = req.body.geom
        let data_type = req.body.data_type
        let geomString = ""
        
        
        // Check a valid geometry type was passed
        if (!geom.type || !_.includes(allowedGeometries, geom.type)) {
            errors.push(`Please provide a valid 'geom.type'`)
        }
        
        
        // Validate & parse point geometries
        if (geom.type === "POINT") {
            if (!geom.x || !geom.y) {
                errors.push(`Please provide an 'x' & 'y' for your 'POINT' geometry`)
            }
            else {
                geomString = `POINT(${geom.x} ${geom.y})`
            }
        }
        
        
        // Validate & parse linestring geometries
        if (geom.type === "LINESTRING") {
            if (!geom.points || !_.isArray(geom.points) || geom.points.length === 0) {
                errors.push(`Please provide an array of points for your LINESTRING`)
            }
            else {
                
                geomString = `LINESTRING(`
                
                // Loop each point, checking it is a valid point
                _.each(geom.points, (point, i) => {
                    
                    if (!point.x || !point.y) {
                        errors.push(`geom.points[${i}]: Each point in a LINESTRING needs an 'x' & 'y'`)
                    }
                    else {
                        geomString += `${point.x} ${point.y},`
                    }
                })
                
                geomString = geomString.slice(0, -1) + ")"
                
            }
        }
        
        
        
        // More types
        // ...
        
        
        // If there were any errors, stop here
        if (errors.length > 0) { return utils.apiFail(res, errors) }
        
        
        
        // Make sure the type exists
        sql `select count(*) as 'count' from data_type
            where id=${data_type} and deployment_id=${req.deployment.id}`
        .then(value => {
            
            // Fail if the type doesn't exist
            if (value[0].count === 0) {
                throw `Invalid data_type '${data_type}'`
            }
            
            // Insert the new geo_data into the database
            return sql `insert into geo_data (geom, deployment_id, data_type_id) values (
                ST_GeomFromText(${geomString}), ${req.deployment.id}, ${data_type}
            )`
        })
        .then(values => {
            
            // If inserted, return the id of the data we created
            utils.apiSuccess(res, values.insertId)
        })
        .catch(error => {
            
            // Return an error if it occured
            utils.apiFail(res, error)
        })
        
    })
    
    
    return router
}
