const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const schema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Please tell us your name'],
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            trim: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            trim: true,
            minlength: 8,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error('Password must contain at least one letter and one number');
                }
            },
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
    {
        timestamps: true,
    }
);

schema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(11);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

schema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

schema.methods.isPasswordMatch = async function (password) {
    const isMatched = await bcrypt.compare(password, this.password);
    return isMatched;
};

const User = mongoose.model('User', schema);

module.exports = User;
