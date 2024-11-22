const { db } = require('../services/storeData');

async function getProfileHandler(request, h) {
    const { idUser } = request.params;

    try {
        // Data dari Firestore
        const userDoc = await db.collection('users').doc(idUser).get();

        if (!userDoc.exists) {
            const response = h.response({
                status: 'fail',
                message: `User with ID ${idUser} not found.`,
            });
            response.code(404);
            return response;
        }

        const userData = userDoc.data();
        const response = h.response({
            status: 'success',
            data: userData,
        });
        response.code(200);
        return response;

    } catch (error) {
        const response = h.response({
            status: 'error',
            message: 'An error occurred while retrieving user data.',
            error: error.message,
        });
        response.code(500);
        return response;

    }
};

module.exports = { getProfileHandler };