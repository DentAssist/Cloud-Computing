require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

(async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
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