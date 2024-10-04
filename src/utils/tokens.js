const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const tokenTypes = require('../config/tokens');

const generateToken = (user, expires, type, secret = config.jwt.secret) => {
    const userObj = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const payload = {
        user: userObj,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };

    return jwt.sign(payload, secret);
};

const generateAuthTokens = (user) => {
    const accessTokenExpires = moment().add(config.jwt.accessTokenExpires, 'minutes');
    const accessToken = generateToken(user, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(config.jwt.refreshTokenExpires, 'days');
    const refreshToken = generateToken(user, refreshTokenExpires, tokenTypes.REFRESH);

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

const storeTokenToCookie = (res, token, expires) => {
    res.cookie('jwt', token, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
    });
};

module.exports = {
    generateAuthTokens,
    storeTokenToCookie,
};
