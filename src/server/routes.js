const postPredictHandler = require('../server/handler');
const getProfileHandler = require('../server/handler');

const routes = [
    {
        path: '/predict',
        method: 'POST',
        handler: postPredictHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
            },
        },
    },
    {
        path: '/{idUser}',
        method: 'GET',
        handler: getProfileHandler,
    }
];

module.exports = routes;