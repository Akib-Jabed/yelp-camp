const catchAsync = require('../utils/catchAsync');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/tokens');
const { authService } = require('../services');

const register = catchAsync(async (req, res) => {
    const user = await authService.createUser(req.body);
    const token = authService.generateToken(user);

    res.status(201).send({ user, token });
});

const login = catchAsync(async (req, res) => {
    const user = await authService.loginUser(req.body);
    const token = authService.generateToken(user);

    res.status(200).send({ user, token });
});

const logout = catchAsync(async (req, res) => {
    await authService.logoutUser(req);

    res.status(204).send();
});

const updatePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!(await user.isPasswordMatch(currentPassword))) {
        throw new ApiError(400, 'Old password not matched');
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user);
    res.status(200).send({ user, token });
});

module.exports = {
    register,
    login,
    logout,
    updatePassword,
};
