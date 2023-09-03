const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Test Backend Eigen',
            description: "Dokumentasi API Backend Test Eigen",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:3000",
                decription: "url development"
            }
        ],
        components: {
            schemas: {
                Member: {
                    type: 'object',
                    require: ['code', 'name', 'password', 'isPenalized', 'bookBorrowed'],
                    properties: {
                        code: {
                            type: 'string',
                            description: 'code member'
                        },
                        name: {
                            type: 'string',
                            description: 'name of member'
                        },
                        password: {
                            type: 'string',
                            description: 'password member'
                        },
                        isPenalized: {
                            type: 'boolean',
                            description: 'if member penalized'
                        },
                        bookBorrowed: {
                            type: 'integer',
                            description: 'total book borrowed'
                        }
                    }
                }
            },
            responses: {
                400: {
                    description: 'invalid login',
                    contents: 'application/json'
                },
    
            }
        }
    },
    apis: ['./routes/index.js']
}

module.exports = options;