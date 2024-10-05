const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (user, expires = config.jwt.expires, secret = config.jwt.secret) => {
    const payload = {
        data: {
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: user.role,
        },
    };

    return jwt.sign(payload, secret, { expiresIn: expires });
};

module.exports = {
    generateToken,
};
