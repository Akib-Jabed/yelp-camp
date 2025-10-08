const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');

const checkLogin = catchAsync(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        throw new ApiError(401, 'Please log in to get access');
    }

    try {
        const decoded = jwt.decode(token, config.jwt.secret);
        req.user = decoded.data;
        next();
    } catch (error) {
        throw new ApiError(403, 'Authorization failed');
    }
});

module.exports = { checkLogin };
