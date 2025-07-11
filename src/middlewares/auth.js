const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');

const checkLogin = catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new ApiError(401, 'Please log in to get access');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new ApiError(401, 'Please log in to get access');
    }

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (err) {
            throw new ApiError(403, 'Token expired.');
        } else {
            const decodedJwt = jwt.decode(token);
            const { data } = decodedJwt;
            req.user = data;
            if (['/deactivate', '/logout'].includes(req.path)) {
                req.token = token;
            }
        }

        next();
    });
});

module.exports = { checkLogin };
