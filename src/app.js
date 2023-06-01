const express = require('express');
const cors = require('cors')
const mongoCxn = require('./js/mongodb.js');
const swaggerApi = require('./js/swagger.js');
const reqRes = require('./js/req-res.js');

const swaggerUI = swaggerApi.swaggerUI;
const swaggerSpec = swaggerApi.swaggerSpec;

const app = express();
app.use(express.json());
app.use(cors())

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

const port = process.env.NODE_PORT || 3000;

/**
 * @swagger
 * /:
 *  get:
 *      summary: Greetings Path
 *      description: Retrieve version and author
 *      responses:
 *          200:
 *              description: successful response
 */
app.get('/', (req, res) => {
    const welcome = {
        message: "Hello from PH locations API",
        version: process.env.npm_package_version,
        author: "g.d.alorro",
        swagger: '/api-docs'
    }
    res.send(welcome)
});

/**
 * @swagger
 * /ph/geo/regions:
 *  get:
 *      summary: Get PH Regions
 *      description: Retrieve list of Philippine regions
 *      parameters:
 *            - in: query
 *              name: id
 *              required: false
 *              description: Region Id
 *            - in: query
 *              name: name
 *              required: false
 *              description: Region Name
 *            - in: query
 *              name: page
 *              required: false
 *              description: Set page number. Positive number. Default is 1
 *            - in: query
 *              name: limit
 *              required: false
 *              description: Set limit for items to retrive. 0 means no limit. Default is 20
 *      responses:
 *          200:
 *              description: successful response
 *  
 */
app.get('/ph/geo/regions', async(req, res) => {
    const response = await reqRes.call(req.query, 'regions');
    !response['error'] ? res.send(response) : res.status(400).send(response);
});

/**
 * @swagger
 * /ph/geo/provinces:
 *  get:
 *      summary: Get PH Provinces
 *      description: Retrieve list of Philippine provinces
 *      parameters:
 *            - in: query
 *              name: id
 *              required: false
 *              description: Province Id
 *            - in: query
 *              name: name
 *              required: false
 *              description: Province Name
 *            - in: query
 *              name: region_code
 *              required: false
 *              description: Region Id
 *            - in: query
 *              name: page
 *              required: false
 *              description: Set page number. Positive number. Default is 1
 *            - in: query
 *              name: limit
 *              required: false
 *              description: Set limit for items to retrive. 0 means no limit. Default is 20
 *      responses:
 *          200:
 *              description: successful response
 *  
 */
app.get('/ph/geo/provinces', async(req, res) => {
    const response = await reqRes.call(req.query, 'provinces');
    !response['error'] ? res.send(response) : res.status(400).send(response);
});

/**
 * @swagger
 * /ph/geo/cities:
 *  get:
 *      summary: Get PH Cities/Municipalities
 *      description: Retrieve list of Philippine cities or municipalities
 *      parameters:
 *            - in: query
 *              name: id
 *              required: false
 *              description: City Id
 *            - in: query
 *              name: name
 *              required: false
 *              description: City Name
 *            - in: query
 *              name: region_code
 *              required: false
 *              description: Region Id
 *            - in: query
 *              name: province_code
 *              required: false
 *              description: Province Id
 *            - in: query
 *              name: page
 *              required: false
 *              description: Set page number. Positive number. Default is 1
 *            - in: query
 *              name: limit
 *              required: false
 *              description: Set limit for items to retrive. 0 means no limit. Default is 20
 *      responses:
 *          200:
 *              description: successful response
 *  
 */
app.get('/ph/geo/cities', async(req, res) => {
    const response = await reqRes.call(req.query, 'cities');
    !response['error'] ? res.send(response) : res.status(400).send(response);
});

/**
 * @swagger
 * /ph/geo/barangays:
 *  get:
 *      summary: Get PH Barangays
 *      description: Retrieve list of Philippine barangays
 *      parameters:
 *            - in: query
 *              name: id
 *              required: false
 *              description: Brgy Id
 *            - in: query
 *              name: name
 *              required: false
 *              description: Brgy Name
 *            - in: query
 *              name: region_code
 *              required: false
 *              description: Region Id
 *            - in: query
 *              name: province_code
 *              required: false
 *              description: Province Id
 *            - in: query
 *              name: city_code
 *              required: false
 *              description: City Id
 *            - in: query
 *              name: page
 *              required: false
 *              description: Set page number. Positive number. Default is 1
 *            - in: query
 *              name: limit
 *              required: false
 *              description: Set limit for items to retrive. 0 means no limit. Default is 20
 *      responses:
 *          200:
 *              description: successful response
 *  
 */
app.get('/ph/geo/barangays', async(req, res) => {
    const response = await reqRes.call(req.query, 'barangays');
    !response['error'] ? res.send(response) : res.status(400).send(response);
});


app.listen(port, async() => {
    await mongoCxn.run((client, error) => {
        if(error) throw error;
        const database = client.db("phlocationsdb");
        reqRes.setDb(database);
        console.log(`API is ready in ${process.env.ENV} and connected on port ${port}`)
    }).catch(e => {
        console.log(e);
    });
});