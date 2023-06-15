module.exports = {
    mongodb: {
        username: process.env.MONGODB_DATABASE_USERNAME,
        password: process.env.MONGODB_DATABASE_PASSWORD,
        name: process.env.MONGODB_DATABASE_NAME || 'ondc-seller',
        host: process.env.MONGODB_DATABASE_HOST || '127.0.0.1:27017',
    }
};
