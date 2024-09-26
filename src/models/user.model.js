/* eslint-disable func-names */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { paginate, toJSON } = require('./plugins');

const { Schema } = mongoose;

const schema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please tell us your first name'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Please tell us your last name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            trim: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        photo: {
            type: String,
            default: 'default.jpg',
        },
        role: {
            type: String,
            enum: ['admin', 'user', 'guide'],
            default: 'user',
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            trim: true,
            minlength: 8,
            select: false,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error('Password must contain at least one letter and one number');
                }
            },
        },
        active: {
            type: Boolean,
            default: true,
        },
        passwordResetToken: String,
        passwordResetExpired: Date,
    },
    {
        timestamps: true,
    }
);

schema.plugin(toJSON);
schema.plugin(paginate);

schema.virtual('fullName').get(() => {
    return `${this.firstName} ${this.lastName}`;
});

schema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 11);
    }

    next();
});

schema.pre('/^find/', function (next) {
    this.find({ active: { $ne: false } });
    next();
});

schema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

schema.methods.isPasswordMatch = async function (password) {
    return bcrypt.compare(password, this.password);
};

schema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpired = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', schema);

module.exports = User;
