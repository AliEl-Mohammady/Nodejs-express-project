const express = require('express');

const router = express.Router();
const verifyToken = require('../midlware/verify.token.js');
const multer = require('multer');

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        console.log(file)
        const extention = file.mimetype.split('/')[1];
        const fileName = `user-img-${Date.now()}.${extention}`
        cb(null, fileName)
    },
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[0] === 'image') {
        return cb(null, true);
    } else {
        return cb(new Error('Only image files are allowed!'), false);
    }
}
const upload = multer({ storage: diskStorage, fileFilter });


const { getAllUsers, registerUser, loginUser } = require('../controller/users.controller.js');

router.route('/').get(verifyToken, getAllUsers)

router.route('/register').post(upload.single('avatar'),registerUser);

router.route('/login').post(loginUser);


module.exports = router;