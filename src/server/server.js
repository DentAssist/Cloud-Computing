require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

// Swagger dependencies
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const package = require('../../package.json');

(async () => {
    const server = Hapi.server({
        port: 8080,
        host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // server.auth.scheme('session', () => ({
    //     authenticate: (request, h) => {
    //       const session = request.state.session;
    //       if (!session) {
    //         throw h.unauthenticated();
    //       }
    //       return h.authenticated({ credentials: session });
    //     },
    //   }));
    
    // server.auth.strategy('session', 'session');
    // server.auth.default('session');

    
    // Setup Swagger options
    const swaggerOptions = {
        info: {
            version: package.version,
            title:'DentAssist API Documentation',
            description: 'An Ml integrated API to predict oral and dental disease',
        },
        tags: [ // predict, auth, user, history, article, clinic
            { name: 'articles', description: 'Endpoints related to article' },
            { name: 'clinics', description: 'Endpoints related to clinic' },
            { name: '{idUser}', description: 'Endpoints related to user profile, prediction, and history' },
            { name: 'login', description: 'Endpoints related to login' },
            { name: 'signup', description: 'Endpoints related to signup' },
            { name: 'logout', description: 'Endpoints related to logout' },
        ],
        // securityDefinitions: {
        //     'jwt': {
        //         'type': 'apiKey',
        //         'name': 'Authorization',
        //         'in': 'header'
        //     }
        // },
        // security: [{ 'jwt': [] }],
        auth: false
    };

    // Register Swagger
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    const model = await loadModel();
    server.app.model = model;

    server.route(routes);

    // Menangani extension dalam Hapi
    server.ext('onPreResponse', function(request, h) {
        const response = request.response;

        // Menangani kesalahan input
        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message}. Please upload other image`,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        };

        // Menangani kesalahan server
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        };

        return h.continue;
    });

    await server.start();
    console.log(`Server start at port ${server.info.uri}`);
})();