const httpStatusText = require('../utills/httpStatusText');
const User = require('../models/users.model');
const asyncWrapper = require('../midlware/asyncWrapper');
const bcrypt = require('bcryptjs');
const accessToken = require('../utills/json.web.token');

const getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    const users = await User.find({}, { password: false, __v: false }).limit(limit).skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: { users } });
}

const registerUser = asyncWrapper(
    async (req, res, next) => {
        const { firstName, lastName, email, password, role } = req.body;
        const oldUser = await User.findOne({ email: email });
        if (oldUser) {
            const error = new Error();
            error.statusCode = 409;
            error.message = "User already exists"
            return next(error);
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, password: hashPassword, role,avatar:req.file.filename });
        const token = accessToken({ id: newUser._id, email: newUser.email,role:newUser.role });
        newUser.token = token;
        await newUser.save();

        res.status(201).json({ status: httpStatusText.CREATED, data: { newUser } });
    }
)

const loginUser = asyncWrapper(
    async (req, res, next) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error();
            error.statusCode = 404;
            error.message = "User not found"
            return next(error);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error();
            error.statusCode = 401;
            error.message = "Password is incorrect"
            return next(error);
        }
        const token = accessToken({ id: user._id, email: user.email, role: user.role });
        res.json({ status: httpStatusText.SUCCESS, token: token });
    }
)

module.exports = {
    getAllUsers,
    registerUser,
    loginUser
}