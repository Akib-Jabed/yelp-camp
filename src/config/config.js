const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
    env: process.env.ENVIRONMENT || 'development',
    port: process.env.PORT || 3000,
    database: {
        url: process.env.DATABASE_URL || 'mongodb://admin:password@localhost:27017/yelp-camp',
    },
    jwt: {
        secret: process.env.SECRET_KEY,
        expires: 24 * 60 * 60, // 1 day
    },
};
