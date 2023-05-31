const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

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
                url: 'http://localhost:3001'
            }
        ]
    },
    apis: [
        './src/app.js'
    ]
}

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerSpec, swaggerUI };