const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.SECRET_KEY,
        expires: 24 * 60 * 60, // 1 day
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    },
    email: {
        from: 'info@yelp-camp.com',
    },
};
