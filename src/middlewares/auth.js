const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const Token = require('../models/token.model');

const checkLogin = catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new ApiError(401, 'Please log in to get access');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new ApiError(401, 'Please log in to get access');
    }

    const blacklistedToken = await Token.findOne({ token });
    if (blacklistedToken) throw new ApiError(400, 'Invalid token');

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (err) {
            throw new ApiError(403, 'Token expired.');
        } else {
            const decodedJwt = jwt.decode(token);
            const { data } = decodedJwt;
            req.user = data;
            if (req.path === '/logout') {
                req.token = token;
            }
        }

        next();
    });
});

const verifyRole = (role) => (req, res, next) => {
    if (role !== req.user.role) throw new ApiError(401, 'Only admins can access users list');

    next();
};

module.exports = { checkLogin, verifyRole };
