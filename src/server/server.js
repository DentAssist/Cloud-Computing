require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');

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

    const model = await loadModel();
    server.app.model = model;

    server.route(routes);

    // Menangani extension dalam Hapi
    server.ext('onPreResponse', function(request, h) {
        const response = request.response;

        // Menangani kesalahan input
        // if (response instanceof InputError) {
        //     const newResponse = h.response({
        //         status: 'fail',
        //         message: `${response.message}. Please upload other image`,
        //     });
        //     newResponse.code(response.statusCode);
        //     return newResponse;
        // };

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