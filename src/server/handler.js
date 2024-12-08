const { all } = require('@tensorflow/tfjs-node');
const { db } = require('../services/storeData');
const { predictClassification, findUserEmail, addUser }  = require('../services/inferenceService');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

async function getUserHandler(request, h) {
    const { idUser } = request.params;

    try {
        const userRef = db.collection('users').doc(idUser);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return h.response({
                status: 'fail',
                message: `User with ID ${idUser} not found.`,
            }).code(404);
        }

        const userData = userDoc.data();

        return h.response({
            status: 'success',
            data: userData,
        }).code(200);

    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Internal server error.',
            error: error.message,
        }).code(500);
    }
};

async function editUserHandler(request, h) {
    const { idUser } = request.params;
    const { username, email, password, city } = request.payload;
    const updatedAt = new Date().toISOString();

    try {
        const userRef = db.collection('users').doc(idUser);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return h.response({
                status: 'fail',
                message: `User with ID ${idUser} not found.`,
            }).code(404);
        }

        const userData = userDoc.data();
        const updateData = {
            username: username || userData.username,
            email: email || userData.email,
            password: password || userData.password,
            city: city || userData.city,
            updatedAt,
        };
        await userRef.update(updateData);

        return h.response({
            status: 'success',
            message: 'User data has been updated successfully.',
        }).code(200);

    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Internal server error.',
            error: error.message,
        }).code(500);
    }
}

async function getAllHistoryHandler(request, h) {
    const { idUser } = request.params;

    try {
        const userRef = db.collection('users').doc(idUser);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return h.response({
                status: 'fail',
                message: `User with ID ${idUser} not found.`,
            }).code(404);
        }

        const historyRef = db.collection('histories').where('idUser', '==', idUser);
        const historyDoc = await historyRef.get();

        const histories = historyDoc.docs.map((doc) => ({
            ...doc.data(),
        }));

        return h.response({
            status: 'success',
            data: histories,
        }).code(200);

    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Internal server error.',
            error: error.message,
        }).code(500);
    }
}

async function deleteAllHistoryHandler(request, h) {
    const { idUser } = request.params;

    try {
        const userRef = db.collection('users').doc(idUser);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return h.response({
                status: 'fail',
                message: `User with ID ${idUser} not found.`,
            }).code(404);
        }

        const historyRef = db.collection('histories').where('idUser', '==', idUser);
        const historyDoc = await historyRef.get();

        if (historyDoc.empty) {
            return h.response({
                status: 'fail',
                message: `No history records found for user ${idUser}.`,
            }).code(404);
        }

        await Promise.all(
            historyDoc.docs.map((doc) => doc.ref.delete())
        );

        return h.response({
            status: 'success',
            message: 'All history data has been deleted successfully.',
        }).code(200);

    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Internal server error.',
            error: error.message,
        }).code(500);
    }
}

async function getHistoryByIdHandler(request, h) { 
    const { idUser, idHistory } = request.params;

    try {
        const userRef = db.collection('users').doc(idUser);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return h.response({
                status: 'fail',
                message: `User with ID ${idUser} not found.`,
            }).code(404);
        }

        const historyRef = db.collection('histories')
            .where('idUser', '==', idUser)
            .where('id', '==', idHistory);
        
        const historyDoc = await historyRef.get();

        if (historyDoc.empty) {
            return h.response({
                status: 'fail',
                message: `History with ID ${idHistory} not found for user ${idUser}.`,
            }).code(404);
        }

        const historyData = historyDoc.docs[0].data();

        return h.response({
            status: 'success',
            data: historyData,
        }).code(200);

    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Internal server error.',
            error: error.message,
        }).code(500);
    }
}

async function deleteHistoryByIdHandler(request, h) {
    const { idUser, idHistory } = request.params;

    try {
        const userRef = db.collection('users').doc(idUser);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return h.response({
                status: 'fail',
                message: `User with ID ${idUser} not found.`,
            }).code(404);
        }

        const historyRef = db.collection('histories')
            .where('idUser', '==', idUser)
            .where('id', '==', idHistory);
        
        const historyDoc = await historyRef.get();

        if (historyDoc.empty) {
            return h.response({
                status: 'fail',
                message: `History with ID ${idHistory} not found for user ${idUser}.`,
            }).code(404);
        }

        await historyDoc.docs[0].ref.delete();

        return h.response({
            status: 'success',
            message: 'History data has been deleted successfully.',
        }).code(200);

    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Internal server error.',
            error: error.message,
        }).code(500);
    }
}

async function getAllArticleHandler(request, h) {
    try {
        const articleRef = db.collection('articles');
        const articles = (await articleRef.get()).docs.map((doc) => ({
            ...doc.data(),
        }));

        return h.response({
            status: 'success',
            data: articles,
        }).code(200);

    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Internal server error.',
            error: error.message,
        }).code(500);
    }
}; 

async function getArticleByIdHandler(request, h) {
    const { idArticle } = request.params;

    try {
        const articleRef = db.collection('articles').doc(idArticle);
        const articleDoc = await articleRef.get();

        if (!articleDoc.exists) {
            return h.response({
                status: 'fail',
                message: `Article with ID ${idArticle} not found.`,
            }).code(404);
        }

        const articleData = articleDoc.data();

        return h.response({
            status: 'success',
            data: articleData,
        }).code(200);

    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Internal server error.',
            error: error.message,
        }).code(500);
    }
}; 

async function getAllClinicHandler(request, h) {
    try {
        const clinicRef = db.collection('clinics');
        const clinics = (await clinicRef.get()).docs.map((doc) => ({
            ...doc.data(),
        }));

        return h.response({
            status: 'success',
            data: clinics,
        }).code(200);

    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Internal server error.',
            error: error.message,
        }).code(500);
    }
};

async function getClinicByIdHandler(request, h) {
    const { idClinic } = request.params;

    try {
        const clinicRef = db.collection('clinics').doc(idClinic);
        const clinicDoc = await clinicRef.get();

        if (!clinicDoc.exists) {
            return h.response({
                status: 'fail',
                message: `Clinic with ID ${idClinic} not found.`,
            }).code(404);
        }

        const clinicData = clinicDoc.data();

        return h.response({
            status: 'success',
            data: clinicData,
        }).code(200);

    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Internal server error.',
            error: error.message,
        }).code(500);
    }
};

async function getAllProductHandler(request, h) {
    try {
        const productRef = db.collection('products');
        const products = (await productRef.get()).docs.map((doc) => ({
            ...doc.data(),
        }));

        return h.response({
            status: 'success',
            data: products,
        }).code(200);

    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Internal server error.',
            error: error.message,
        }).code(500);
    }
};

async function getProductByIdHandler(request, h) {
    const { idProduct } = request.params;

    try {
        const productRef = db.collection('products').doc(idProduct);
        const productDoc = await productRef.get();

        if (!productDoc.exists) {
            return h.response({
                status: 'fail',
                message: `Product with ID ${idProduct} not found.`,
            }).code(404);
        }

        const productData = productDoc.data();

        return h.response({
            status: 'success',
            data: productData,
        }).code(200);

    } catch (error) {
        return h.response({
            status: 'error',
            message: 'Internal server error.',
            error: error.message,
        }).code(500);
    }    
}

async function postPredictHandler(request, h) {
    const { idUser, image } = request.payload;
    const { model } = request.server.app;

    const userRef = db.collection('users');
    const isUserExist = await userRef.where('id', '==', idUser).get();

    if (isUserExist.empty) {
        const response = h.response({
            status: 'fail',
            message: 'User not found',
        });
        response.code(401);
        return response;
    };

    const userSnapshot = isUserExist.docs[0].data();

    // Predict image
    const { confidenceScore, label, suggestion, explanation } = await predictClassification(model, image);
    const id = crypto.randomUUID();  
    const createdAt = new Date().toISOString();

    const articleRef = db.collection('articles');
    const articleDoc = await articleRef.where('disease', '==', label).get();
    const articleSnapshot = !articleDoc.empty ? articleDoc.docs[0].data() : null;

    const productRef = db.collection('products');
    const productDoc = await productRef.where('disease', '==', label).get();
    const productSnapshot = !productDoc.empty ? productDoc.docs[0].data() : null;

    const clinicRef = db.collection('clinics');
    const clinicDoc = await clinicRef.where('city', '==', userSnapshot.city).get();
    const clinicSnapshot = !clinicDoc.empty ? clinicDoc.docs[0].data() : null;

    const data = {
        'id': id,
        'idUser': idUser, 
        'label': label,
        'confidenceScore': confidenceScore,
        'explanation': explanation,
        'suggestion': suggestion,
        'idClinic': clinicSnapshot ? clinicSnapshot.idClinic : 'Klinik belum tersedia di wilayah Anda!',
        'idProduct': productSnapshot ? productSnapshot.idProduct : 'Produk tidak ditemukan!',
        'product': productSnapshot ? productSnapshot.name : 'Produk tidak ditemukan!',
        'idArticle': articleSnapshot ? articleSnapshot.idArticle : 'Artikel tidak ditemukan',
        'article': articleSnapshot ? articleSnapshot.name : 'Artikel tidak ditemukan',
        'createdAt': createdAt,
    };

    // Store data to Firestore 'histories' collection
    const historyRef = db.collection('histories');
    await historyRef.doc(id).set(data);

    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data,
    });
    response.code(201);
    return response;
};

async function postSignupHandler(request, h) {
    const { email, username, password, city } = request.payload;

    // Validate email format
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormat.test(email)) {
        const response = h.response({
            status: 'fail',
            message: 'Invalid email format!',
        });
        response.code(400);
        return response;
    };

    const isEmailExist = await findUserEmail(email);
    if (isEmailExist) {
        const response = h.response({
            status: 'fail',
            message: 'Email already exist. Please use another email!'
        });
        response.code(400);
        return response;
    };

    // validate username format (min 3 char and max 30 char)
    if (username.length < 3 || username.length > 30) {
        const response = h.response({
            status: 'fail',
            message: 'Username must be between 3 and 30 characters!',
        });
        response.code(400);
        return response;
    };

    // validate password format (min 8 char of letter and number, and at least have 1 number)
    const passwordFormat = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (!passwordFormat.test(password)) {
        const response = h.response({
            status: 'fail',
            message: 'Password must be at least 8 characters long and contain both letters and numbers.',
        });
        response.code(400);
        return response;
    };

    await addUser(email, username, password, city);

    const response = h.response({
        status: 'success',
        message: 'Register Success!',
    });
    response.code(201);
    return response;
};

async function loginHandler(request, h) {
    const { email, password } = request.payload;

    const user = await findUserEmail(email);
    if (!user) {
        const response = h.response({
            status: 'fail',
            message: 'Email is not registered!',
        });
        response.code(401);
        return response;
    };
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (email !== user.email || !isPasswordValid) {
        const response = h.response({
            status: 'fail',
            message: 'Invalid Email or Password!',
        });
        response.code(401);
        return response;
    };
    
    const response = h.response({
        status: 'success',
        message: 'Login Success!',
        idUser: user.id,
    });
    response.state('session', user.id, {ttl: 24 * 60 * 60 * 1000, isHttpOnly: true, isSecure: true});
    response.code(200);
    return response;
};

async function logoutHandler(request, h) {
    const response = h.response({
        status: 'success',
        message: 'Logout successful!',
    });
    response.unstate('session');
    response.code(200);
    return response;
};

async function checkSessionHandler(request, h) {
    // const session = request.state.session;

    // if(!session) {
    //     const response = h.response({
    //         status: 'fail',
    //         message: 'No active session found',
    //     });
    //     response.code(401);
    //     return response;
    // };

    // try {

    //     const userEmail = session;
    //     const user = await findUserEmail(userEmail);

    //     if (!user) {
    //         const response = h.response({
    //             status: 'fail',
    //             message: 'Invalid session!',
    //         });
    //         response.code(401);
    //         return response;
    //     };

    //     const response = h.response({
    //         status: 'success',
    //         message: 'Session is active',
    //     });
    //     response.code(200);
    //     return response;

    // } catch (error) {
    //     const response = h.response({
    //         status: 'fail',
    //         message: 'An error occured while checking the session!',
    //     });
    //     response.code(500);
    //     return response;
    // }
};

module.exports = { 
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
};