module.exports = {
    s3: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION,
        version: process.env.S3_VERSION,
        bucket: process.env.S3_BUCKET
    }
};
