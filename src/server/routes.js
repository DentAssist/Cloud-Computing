const Joi = require('joi');
const { 
    getUserHandler, 
    editUserHandler, 
    getAllHistoryHandler, 
    deleteAllHistoryHandler, 
    getHistoryByIdHandler, 
    deleteHistoryByIdHandler, 
    getAllArticleHandler, 
    getArticleByIdHandler, 
    getAllClinicHandler, 
    getClinicByIdHandler, 
    getAllProductHandler,
    getProductByIdHandler,
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
                    idUser: Joi.string().required().description('User ID'),
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
        path: '/auth/signup',
        method: 'POST',
        handler: postSignupHandler,
        options: {
            tags: ['api', 'auth'],
            description: 'Register a new user',
            notes: 'Request payload should include email, username, and password.',
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required().description('User email'),
                    username: Joi.string().required().description('User name'),
                    password: Joi.string().required().description('User password'),
                    city: Joi.string().required().description('User city'),
                }),
            },
        },
    },
    {
        path: '/auth/login',
        method: 'POST',
        handler: loginHandler,
        options: {
            tags: ['api', 'auth'],
            description: 'Log in a user',
            notes: 'Request body must include email and password.',
            validate: {
                payload: Joi.object({  
                    email: Joi.string().email().required().description('User email'),
                    password: Joi.string().required().description('User password'),
                }),
            },
        },
    },
    {
        path: '/auth/logout',
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
        path: '/users/{idUser}',
        method: 'GET',
        handler: getUserHandler,
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
        path: '/users/{idUser}',
        method: 'PUT',
        handler: editUserHandler,
        options: {
            tags: ['api', 'user'],
            description: 'Update user profile',
            notes: 'Requires user ID and updated profile details, including file upload.',
            validate: {
                params: Joi.object({
                    idUser: Joi.string().required().description('User ID'),
                }),
                payload: Joi.object({
                    username: Joi.string().optional().description('User name'),
                    email: Joi.string().email().optional().description('User email'),
                    password: Joi.string().optional().description('User password'),
                    city: Joi.string().optional().description('User city'),
                    profileImage: Joi.any()
                        .meta({ swaggerType: 'file' })
                        .optional()
                        .description('Profile image file'),
                }),
            },
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                parse: true
            },
        },
    },    
    {
        path: '/users/{idUser}/histories',
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
        path: '/users/{idUser}/histories',
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
        path: '/users/{idUser}/histories/{idHistory}',
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
        path: '/users/{idUser}/histories/{idHistory}',
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
    {
        path: '/products',
        method: 'GET',
        handler: getAllProductHandler,
        options: {
            tags: ['api', 'product'],
            description: 'Get all products',
            notes: 'Fetches all products available in the system.',
        },
    },
    {
        path: '/products/{idProduct}',
        method: 'GET',
        handler: getProductByIdHandler,
        options: {
            tags: ['api', 'product'],
            description: 'Get a product by ID',
            notes: 'Fetches details of a specific product by its ID.',
            validate: {
                params: Joi.object({
                    idProduct: Joi.string().required().description('Product ID'),
                }),
            },
        },
    }
];

module.exports = routes;