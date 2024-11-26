const postPredictHandler = require('../server/handler');
const { getProfileHandler, editProfileHandler, getAllHistoryHandler, deleteAllHistoryHandler, getHistoryByIdHandler, deleteHistoryByIdHandler, getAllArticleHandler, getArticleByIdHandler, getAllClinicHandler, getClinicByIdHandler } = require('../server/handler');

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
    },
    {
        path: '/{idUser}',
        method: 'PUT',
        handler: editProfileHandler,
    },
    {
        path: '/{idUser}/histories',
        method: 'GET',
        handler: getAllHistoryHandler,
    },
    {
        path: '/{idUser}/histories',
        method: 'DELETE',
        handler: deleteAllHistoryHandler,
    },
    {
        path: '/{idUser}/histories/{idHistory}',
        method: 'GET',
        handler: getHistoryByIdHandler,
    },
    {
        path: '/{idUser}/histories/{idHistory}',
        method: 'DELETE',
        handler: deleteHistoryByIdHandler,
    },
    {
        path: '/articles',
        method: 'GET',
        handler: getAllArticleHandler
    },
    {
        path: '/articles/{idArticle}',
        method: 'GET',
        handler: getArticleByIdHandler
    },
    {
        path: '/clinics',
        method: 'GET',
        handler: getAllClinicHandler
    },
    {
        path: '/clinics/{idClinic}',
        method: 'GET',
        handler: getClinicByIdHandler
    },
];

module.exports = routes;