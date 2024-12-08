const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.CLOUD_BUCKET_ACCESS_KEY,
});

const bucketName = process.env.BUCKET_NAME;
const bucket = storage.bucket(bucketName);

module.exports = { storage, bucketName, bucket };