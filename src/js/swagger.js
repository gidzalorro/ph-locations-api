const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

let serverUrl = 'http://localhost:3001';
if(process.env.ENV === 'PROD'){
    serverUrl = 'https://ph-locations-api.onrender.com'
}

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'PH Locations API',
            description: 'This API retrieves Philippine locations such as regions, provinces, cities/municipalities and barangays.',
            version: process.env.npm_package_version,
            contact: {
                name: "g.d.alorro"
            }
        },
        servers: [
            {
                url: serverUrl
            }
        ]
    },
    apis: [
        './src/app.js'
    ]
}

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerSpec, swaggerUI };