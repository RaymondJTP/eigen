const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Swagger Eigen Test',
            description: 'Berikut di bawah dokumentasi list API untuk test backend eigen',
            version: '1.0.0'
        },
        components: {
            securitySchemes: {
                access_token: {
                    type: 'apiKey',
                    name: 'access_token',
                    in: 'header'
                }
            }
        },
        tags : [
            {
                name: 'Member'
            },
            {
                name: 'Books'
            }
        ]
    },
    apis: [ './controllers/bookController.js', './controllers/memberController.js']
}

module.exports = options;