const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services');

const register = catchAsync(async (req, res) => {
    const user = await authService.registerUser(req.body);
    const token = authService.generateToken(user);

    res.status(201).send({ user, token });
});

const login = catchAsync(async (req, res) => {
    const user = await authService.loginUser(req.body);
    const token = authService.generateToken(user);

    res.status(200).send({ user, token });
});

module.exports = {
    register,
    login,
};
