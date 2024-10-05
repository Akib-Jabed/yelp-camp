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
};
