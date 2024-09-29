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
        accessTokenExpires: 15,
        refreshTokenExpires: 3,
        resetPasswordExpires: 30,
        verifyEmailExpires: 30,
    },
};
