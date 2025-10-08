const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (userId, expires = config.jwt.expires, secret = config.jwt.secret) => {
    const payload = {
        data: {
            id: userId
        },
    };

    return jwt.sign(payload, secret, { expiresIn: expires });
};

module.exports = {
    generateToken,
};
