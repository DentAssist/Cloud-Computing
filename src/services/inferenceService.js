const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
const { db } = require('./storeData');
const bcrypt = require('bcrypt');
const { bucket } = require('./storeImage');
const { version } = require('joi');

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

        const classes = ['Calculus', 'Caries', 'Healthy', 'Hypodontia', 'Mouth Ulcer'];
        const classResult = tf.argMax(prediction, axis=1).dataSync()[0];
        const label = classes[classResult];

        let suggestion, explanation;
        switch (label) {
            case 'Calculus':
                explanation = 'Karang gigi adalah timbunan plak yang membentuk lapisan seperti kotoran yang mengeras di gigi. Berbeda dengan plak biasa, kondisi ini lebih sulit untuk dihilangkan dengan sikat gigi biasa. Hal yang menjadi penyebab karang gigi adalah plak yang tidak kamu bersihkan, hingga akhirnya menumpuk dan mengeras pada gigi.';
                suggestion = 'Anda disarankan untuk mengobati Calculus';
                break;
            case 'Healthy':
                explanation = 'Gigi yang sehat memiliki warna putih alami dengan sedikit krem kekuningan, permukaan halus tanpa retakan atau lubang, serta tersusun rapi tanpa rasa nyeri atau sensitivitas berlebihan. Gusi yang sehat berwarna pink pucat, tidak mudah berdarah, dan nafas tetap segar menandakan kebersihan mulut yang terjaga.';
                suggestion = 'Anda disarankan untuk terus menjaga kesehatan mulut dan gigi Anda';
                break;
            case 'Mouth Ulcer':
                explanation = 'Mouth ulcer atau disebut juga dengan istilah aphthous stomatitis atau sariawan adalah kondisi hilangnya atau terkikisnya bagian jaringan halus yang melapisi bagian dalam mulut (mucous membrane).';
                suggestion = 'Anda disarankan untuk mengobati Sariawan';
                break;
            case 'Caries':
                explanation = 'Karies gigi adalah kondisi ketika lapisan struktur gigi mengalami kerusakan secara bertahap. Kondisi ini terjadi ketika bakteri yang melekat di gigi, terutama Streptococcus mutans, menghasilkan asam dari sisa-sisa makanan seperti karbohidrat. Asam tersebut bisa merusak jaringan keras gigi, dimulai dari lapisan terluar atau enamel gigi, lalu lapisan tengah atau dentin dan pada akhirnya merusak akar gigi.';
                suggestion = 'Anda disarankan untuk mengobati Caries';
                break;
        }

        return { confidenceScore, label, suggestion, explanation };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan: ${error.message}`);
    }
};

async function addUser(email, username, password, city) {
    try {
        const userRef = db.collection('users');
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = userRef.doc().id;
        const createdAt = new Date().toISOString();
        const defaultImage = './public/image/default-profile-picture.png';

        const data = {
            'id': userId,
            'email': email,
            'username': username,
            'password': hashedPassword,
            'city': city,
            'profileImage': defaultImage,
            createdAt,
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

async function uploadImageToBucket (image, fileName) {
    const file = bucket.file(`${fileName}`);

    try {
        await file.save(image, {
            metadata: {contentType: 'image/jpeg'},
        });
    } catch (error) {
        console.error('Error uploading file to bucket: ', error.message);
        throw new Error('Failed to upload file');
    }
};

async function getSignedUrl (filePath) {
    const file = bucket.file(filePath);
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000,
    };

    const [signedUrl] = await file.getSignedUrl(options);
    return signedUrl;
};

module.exports = { predictClassification, addUser, findUserEmail, uploadImageToBucket, getSignedUrl };