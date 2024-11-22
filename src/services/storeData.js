const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore({
    keyFilename: process.env.FIRESTORE_ACCESS_KEY,
    projectId: process.env.PROJECT_ID
});

module.exports = { db };