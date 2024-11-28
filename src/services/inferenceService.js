const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

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

module.exports = predictClassification;