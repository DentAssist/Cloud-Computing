const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
const { db } = require('./storeData');
const bcrypt = require('bcrypt');

async function predictClassification(model, image) {
    try {
        // Konversi gambar menjadi tensor
        const tensor = tf.node.decodePng(image).resizeNearestNeighbor([224, 224]).expandDims().toFloat();

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = score[0] * 100;

        let predictionResult = '';
        
        if (confidenceScore > 50) {
            predictionResult = 'Cancer';
        };

        if (confidenceScore <= 50) {
            predictionResult = 'Non-Cancer';
        };

        const label = predictionResult;
        let suggestion;

        if (label === 'Cancer') {
            suggestion = 'Segera Periksa ke Dokter';
        };

        if (label === 'Non-Cancer') {
            suggestion = 'Penyakit Kanker Tidak Terdeteksi';
        };

        return {confidenceScore, label, suggestion};
    } catch (error) {
        throw new InputError(`${error.message}`);
    };
};

async function addUser(email, username, password) {
    try {
        const userRef = db.collection('users');
        const hashedPassword = await bcrypt.hash(password, 10);

        const data = {
            'id': userRef.doc().id,
            'email': email,
            'username': username,
            'password': hashedPassword,
        };

        await userRef.doc(email).set(data);
    } catch (error) {
        throw new Error('Failed to add user');
    }
};

async function findUserEmail(email) {
    const userRef = db.collection('users');
    const snapshot = await userRef.where('email', '==', email).get();
    if (snapshot.empty) {
        return null;
    }

    return snapshot.docs[0].data();
};

module.exports = { predictClassification, addUser, findUserEmail };