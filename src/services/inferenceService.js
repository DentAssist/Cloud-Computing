const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
const { db } = require('./storeData');
const bcrypt = require('bcrypt');

async function predictClassification(model, image) {
    try {
        // Preprocessing image sesuai dengan model
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([150, 150])
            .expandDims() 
            .toFloat()
            .div(255.0); // Normalisasi ke [0, 1]

        // Prediksi menggunakan model
        const prediction = model.predict(tensor); 
        const scores = await prediction.data(); 
        const confidenceScore = Math.max(...scores) * 100; // Ambil skor tertinggi

        const classes = ['class A', 'class B', 'class C', 'class D', 'class E'];
        const classResult = tf.argMax(prediction, axis=1).dataSync()[0];
        const label = classes[classResult];

        let suggestion;
        switch (label) {
            case 'class A':
                suggestion = 'ini class A';
                break;
            case 'class B':
                suggestion = 'ini class B';
                break;
            case 'class C':
                suggestion = 'ini class C';
                break;
            case 'class D':
                suggestion = 'ini class D';
                break;
            case 'class E':
                suggestion = 'ini class E';
                break;
        }

        return { confidenceScore, label, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan: ${error.message}`);
    }
};

async function addUser(email, username, password) {
    try {
        const userRef = db.collection('users');
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = userRef.doc().id;

        const data = {
            'id': userId,
            'email': email,
            'username': username,
            'password': hashedPassword,
        };

        await userRef.doc(userId).set(data);
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