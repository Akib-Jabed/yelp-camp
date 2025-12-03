const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services');
const { generateToken } = require('../utils/tokens');
const config = require('../config/config');

const register = catchAsync(async (req, res) => {
    const user = await authService.registerUser(req.body);
    const token = generateToken(user.id);
    
    res.cookie('token', token, {
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        expires: new Date(Date.now() + config.jwt.expires * 1000),
        sameSite: 'strict',
    }).status(201).send({ success: true, data: user });
});

const login = catchAsync(async (req, res) => {
    const user = await authService.loginUser(req.body);
    const token = generateToken(user.id);
    
    res.cookie('token', token, {
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        expires: new Date(Date.now() + config.jwt.expires * 1000),
        sameSite: 'strict',
    }).status(200).send({ success: true, data: user });
});

const logout = catchAsync(async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        expires: new Date(0),
        sameSite: 'strict',
    }).status(200).send({ success: true });
});

const me = catchAsync(async (req, res) => {
    const user = await authService.getUser(req.user);
    
    res.status(200).send({ success: true, data: user });
});

module.exports = {
    register,
    login,
    logout,
    me
};
