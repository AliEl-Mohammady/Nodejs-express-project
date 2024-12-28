const express = require('express');

const router = express.Router();
// const app = express();

const validationSchema = require('../midlware/validationSchema');

const { getCourses, createCourse, getSingleCourse, updateCourse, deleteCourse } = require('../controller/courses.controller.js');
const verifyToken = require('../midlware/verify.token.js');
const { ADMIN, USER, MANAGER } = require('../utills/user.role');
const allowedTo = require('../midlware/allowedTo.rol.js');

router.route('/').get(getCourses)
                .post(validationSchema(), createCourse);

router.route('/:id').patch( updateCourse)
                    .delete(verifyToken, allowedTo(MANAGER, ADMIN),deleteCourse)
                    .get(getSingleCourse);


module.exports = router;