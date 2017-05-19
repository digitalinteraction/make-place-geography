
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
    router.get("/", async (req, res) => {
        
        try {
            let result = await sql `
                select *, ST_GeometryType(geom) as 'type' from geo_data
                where deployment_id=${req.deployment.id}`
            
            utils.apiSuccess(res, result)
        }
        catch (error) { utils.apiFail(res, error) }
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
    router.get("/:id", async (req, res) => {
        
        try {
            let result = await sql `
                select *, ST_GeometryType(geom) as 'type' from geo_data
                where deployment_id=${req.deployment.id}
                and id=${req.params.id}`
            
            if (result.length === 0) {
                utils.apiFail(res, `geo_data '${req.params.id}' not found`)
            }
            else {
                utils.apiSuccess(res, result[0])
            }
        }
        catch (error) { utils.apiFail(res, error) }
    })
    
    
    
    
    
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
    router.post("/", async (req, res) => {
        
        // Build errors with the request
        let errors = []
        
        // Check the data_type and geom were passed
        utils.guard(errors, req.body.data_type, `Please provide a 'data_type'`)
        utils.guard(errors, _.isObject(req.body.geom), `Please provide 'geom' as an object`)
        
        
        // Fail now if there were any errors
        if (errors.length > 0) { return utils.apiFail(res, errors) }
        
        
        // Get validated values from the request
        let geom = req.body.geom
        let data_type = req.body.data_type
        let geomString = ""
        
        
        // Check a valid geometry type was passed
        utils.guard(errors, geom.type && _.includes(allowedGeometries, geom.type),
            `Please provide a valid 'geom.type'`
        )
        
        
        // Validate & parse point type geometries
        if (geom.type === "POINT") {
            utils.guard(errors, geom.x && geom.y, `Point needs an an 'x' & 'y'` )
            geomString = `POINT(${geom.x} ${geom.y})`
        }
        
        // Validate & parse linestring type geometries
        if (geom.type === "LINESTRING") {
            
            // Check the geom is an array with at least 2 points
            utils.guard(errors, _.isArray(geom.points) && geom.points.length > 1,
                `Please provide an array of points for your LINESTRING`
            )
            
            if (errors.length == 0) {
                
                // Loop each point, checking it is a valid point
                let pointStrings = _.map(geom.points, (point, i) => {
                    utils.guard(errors, point.x && point.y, `geom.points[${i}] needs an 'x' and 'y'`)
                    return `${point.x} ${point.y}`
                })
                
                geomString = `LINESTRING(${ _.join(pointStrings, ',') })`;
            }
        }
        
        
        // More types
        // ...
        
        
        // If there were any errors, stop here
        if (errors.length) return utils.apiFail(res, errors)
        
        
        try {
            
            // Query for a deployment with that id
            let types = await sql `
                select count(*) as 'count' from data_type
                where id=${data_type} and deployment_id=${req.deployment.id}`
            
            // Fail if the type doesn't exist
            if (types[0].count === 0) {
                throw `Invalid data_type '${data_type}'`
            }
            
            // Insert a new record with the geometry string
            let record = await sql `
                insert into geo_data (geom, deployment_id, data_type_id) values (
                ST_GeomFromText(${geomString}), ${req.deployment.id}, ${data_type})`
            
            // Return the id of the new record
            utils.apiSuccess(res, record.insertId);
        }
        catch (error) {
            
            // Return an error if it occured
            utils.apiFail(res, error);
        }
    })
    
    
    return router
}
