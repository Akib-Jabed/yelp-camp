const catchAsync = require('../utils/catchAsync');
const { User, Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/tokens');

const register = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;

    if (await User.isEmailTaken(email)) {
        throw new ApiError(400, 'Email already taken');
    }

    const newUser = {
        name,
        email,
        password,
    };
    await User.create(newUser);

    delete newUser.password;
    const token = generateToken(newUser);

    res.status(201).send({ newUser, token });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(403, 'Invalid credential');
    }

    user.password = undefined;
    const token = generateToken(user);

    res.status(200).send({ user, token });
});

const logout = catchAsync(async (req, res) => {
    const { token, user } = req;

    await Token.create({ token, user: user.id, blacklisted: true });

    res.status(200).send();
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
