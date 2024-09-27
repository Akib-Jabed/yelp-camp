const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const tokenTypes = require('../config/tokens');

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };

    return jwt.sign(payload, secret);
};

const generateAuthTokens = (user) => {
    const accessTokenExpires = moment().add(config.jwt.accessTokenExpires, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(config.jwt.refreshTokenExpires, 'days');
    const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
            type: tokenTypes.ACCESS,
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
            type: tokenTypes.REFRESH,
        },
    };
};

module.exports = {
    generateAuthTokens,
};
