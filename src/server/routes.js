const Joi = require('joi');
const { 
    getProfileHandler, 
    editProfileHandler, 
    getAllHistoryHandler, 
    deleteAllHistoryHandler, 
    getHistoryByIdHandler, 
    deleteHistoryByIdHandler, 
    getAllArticleHandler, 
    getArticleByIdHandler, 
    getAllClinicHandler, 
    getClinicByIdHandler, 
    postPredictHandler, 
    postSignupHandler, 
    loginHandler, 
    logoutHandler, 
    checkSessionHandler 
} = require('../server/handler');

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
            tags: ['api', 'predict'],
            description: 'Predict oral and dental disease',
            notes: 'Request payload must include an image file in form-data with key "image".',
            validate: {
                payload: Joi.object({
                    image: Joi.any()
                        .meta({ swaggerType: 'file' }) 
                        .required()
                        .description('Image file for prediction'),
                }),
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form', 
                },
            },
        },
    },
    {
        path: '/signup',
        method: 'POST',
        handler: postSignupHandler,
        options: {
            tags: ['api', 'auth'],
            description: 'Register a new user',
            notes: 'Request payload should include email, username, and password.',
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required().description('Valid email address'),
                    username: Joi.string().min(3).max(30).required().description('Username between 3 and 30 characters'),
                    password: Joi.string().pattern(/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/).required().description('Password with at least 8 characters, including letters and numbers'),
                }),
            },
        },
    },
    {
        path: '/login',
        method: 'GET',
        handler: loginHandler,
        options: {
            tags: ['api', 'auth'],
            description: 'Log in a user',
            notes: 'Request query must include email and password.',
            validate: {
                query: Joi.object({
                    email: Joi.string().email().required().description('Registered email address'),
                    password: Joi.string().required().description('User password'),
                }),
            },
        },
    },
    {
        path: '/logout',
        method: 'POST',
        handler: logoutHandler,
        options: {
            tags: ['api', 'auth'],
            description: 'Log out a user',
            notes: 'Clears the user session.',
        },
    },
    {
        path: '/check-session',
        method: 'GET',
        handler: checkSessionHandler,
    },
    {
        path: '/{idUser}',
        method: 'GET',
        handler: getProfileHandler,
        options: {
            tags: ['api', 'user'],
            description: 'Retrieve user profile by ID',
            notes: 'Requires valid user ID.',
            validate: {
                params: Joi.object({
                    idUser: Joi.string().required().description('User ID'),
                }),
            },
        },
    },
    {
        path: '/{idUser}',
        method: 'PUT',
        handler: editProfileHandler,
        options: {
            tags: ['api', 'user'],
            description: 'Update user profile',
            notes: 'Requires user ID and updated profile details.',
            validate: {
                params: Joi.object({
                    idUser: Joi.string().required().description('User ID'),
                }),
                payload: Joi.object({
                    name: Joi.string().optional().description('User name'),
                    email: Joi.string().email().optional().description('User email'),
                    password: Joi.string().optional().description('User password'),
                    city: Joi.string().optional().description('User city'),
                }),
            },
        },
    },
    {
        path: '/{idUser}/histories',
        method: 'GET',
        handler: getAllHistoryHandler,
        options: {
            tags: ['api', 'user'],
            description: 'Get all user histories',
            notes: 'Fetches all history records for a specific user.',
            validate: {
                params: Joi.object({
                    idUser: Joi.string().required().description('User ID'),
                }),
            },
        },
    },
    {
        path: '/{idUser}/histories',
        method: 'DELETE',
        handler: deleteAllHistoryHandler,
        options: {
            tags: ['api', 'user'],
            description: 'Delete all user histories',
            notes: 'Deletes all history records for a specific user.',
            validate: {
                params: Joi.object({
                    idUser: Joi.string().required().description('User ID'),
                }),
            },
        },
    },
    {
        path: '/{idUser}/histories/{idHistory}',
        method: 'GET',
        handler: getHistoryByIdHandler,
        options: {
            tags: ['api', 'user'],
            description: 'Get a user history by ID',
            notes: 'Fetches a specific history record by its ID for a user.',
            validate: {
                params: Joi.object({
                    idUser: Joi.string().required().description('User ID'),
                    idHistory: Joi.string().required().description('History ID'),
                }),
            },
        },
    },
    {
        path: '/{idUser}/histories/{idHistory}',
        method: 'DELETE',
        handler: deleteHistoryByIdHandler,
        options: {
            tags: ['api', 'user'],
            description: 'Delete a user history by ID',
            notes: 'Deletes a specific history record by its ID for a user.',
            validate: {
                params: Joi.object({
                    idUser: Joi.string().required().description('User ID'),
                    idHistory: Joi.string().required().description('History ID'),
                }),
            },
        },
    },
    {
        path: '/articles',
        method: 'GET',
        handler: getAllArticleHandler,
        options: {
            tags: ['api', 'article'],
            description: 'Get all articles',
            notes: 'Fetches all articles available in the system.',
        },
    },
    {
        path: '/articles/{idArticle}',
        method: 'GET',
        handler: getArticleByIdHandler,
        options: {
            tags: ['api', 'article'],
            description: 'Get an article by ID',
            notes: 'Fetches a specific article by its ID.',
            validate: {
                params: Joi.object({
                    idArticle: Joi.string().required().description('Article ID'),
                }),
            },
        },
    },
    {
        path: '/clinics',
        method: 'GET',
        handler: getAllClinicHandler,
        options: {
            tags: ['api', 'clinic'],
            description: 'Get all clinics',
            notes: 'Fetches all clinics available in the system.',
        },
    },
    {
        path: '/clinics/{idClinic}',
        method: 'GET',
        handler: getClinicByIdHandler,
        options: {
            tags: ['api', 'clinic'],
            description: 'Get a clinic by ID',
            notes: 'Fetches details of a specific clinic by its ID.',
            validate: {
                params: Joi.object({
                    idClinic: Joi.string().required().description('Clinic ID'),
                }),
            },
        },
    },
];

module.exports = routes;