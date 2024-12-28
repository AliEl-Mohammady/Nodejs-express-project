const mongose = require('mongoose');
const validator = require('validator');
const { ADMIN, USER, MANAGER } = require('../utills/user.role');

const userSchema = new mongose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email address'
        }
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: [ADMIN, USER, MANAGER],
        default: USER
    },
    avatar: {
        type: String,
        default: '../uploads/profile.png'
    }
});

module.exports = mongose.model('User', userSchema);