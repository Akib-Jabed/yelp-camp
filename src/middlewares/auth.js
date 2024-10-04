const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const ApiError = require('./error');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const { generateAuthTokens, storeTokenToCookie } = require('../utils/tokens');

const checkLogin = catchAsync((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please log in to get access...');
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please log in to get access...');
    }

    jwt.verify(accessToken, config.jwt.secret, async (err, decoded) => {
        // if (err) {
        // if (err.name === 'TokenExpiredError') {
        const decodedJwt = jwt.decode(accessToken);
        const { user } = decodedJwt;
        const tokens = generateAuthTokens(user);
        /*
            user: {
                id:
                email:
                role:
            }
        */
        console.log(decodedJwt);
        // } else {
        //     return ApiError(401, 'Token expired');
        // }
        // }
    });

    next();
});

module.exports = checkLogin;
