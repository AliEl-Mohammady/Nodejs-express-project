const express = require('express');
const app = express();
const httpStatusText = require('../utills/httpStatusText');
// let  courses  = require('../data/courser_data');
const { validationResult } = require('express-validator');

const Course = require('../models/courses.model');
const asyncWrapper = require('../midlware/asyncWrapper');

const getCourses = async(req, res) => {
    // const courses =await  Course.find();
//Controll data back to user
    // const courses = await Course.find({price:{$gt:30}});
    // const courses = await Course.find({ name: "OWl" } ,{name:1,price:1,_id:1});
//Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    const courses = await Course.find().limit(limit).skip(skip);
    res.json({status: httpStatusText.SUCCESS, data: {courses}});
}

const getSingleCourse = asyncWrapper(
    async (req, res,next) => {
    // const courseId = parseInt(req.params.id);
    // const course = courses.find(c => c.id === courseId);
    const course = await Course.findById(req.params.id);
    if (!course) {
        const error = new Error();
        error.statusCode = 404;
        error.message = "Course not found"
        return next(error);
    }

    res.json({ status: httpStatusText.SUCCESS, data: { course } });
    // try {

    // } catch (error) {
    //     res.status(404).json({ status: httpStatusText.ERROR, message: error.message,code:400 });
    // }
})


const createCourse = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: httpStatusText.BAD_REQUEST,errors: { msg: errors.array() }});

    // if (!course.name || !course.price) return res.status(400).json({ error: "Name and price are required" });
    // const course = req.body;
    // const newCourse = {
    //     id: courses.length + 1,
    //     ...course
    // }
    // courses.push(newCourse);

    const newCourse = new Course(req.body);
    await newCourse.save();

    res.status(201).json({ status: httpStatusText.CREATED, data: { newCourse } });
}

const updateCourse =async (req, res) => {
    // const courseId = parseInt(req.params.id);
    // const course = courses.find(c => c.id === courseId);
    // const { name, price } = req.body;
    // if (name) course.name = name;
    // if (price) course.price = price;
    try {
        const courseId = await Course.findById(req.params.id);
        if (!courseId) res.status(404).json({ status: httpStatusText.NOT_FOUND, message: { msg: "Course not found" } });

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true } // Return updated document and validate schema
        );
        res.json({ status: httpStatusText.SUCCESS, data: { updatedCourse } });
    } catch (error) {
        res.status(400).json({ status: httpStatusText.ERROR, message: error.message, code: 400 });
    }
}

const deleteCourse =async (req, res) => {
    // const courseId = parseInt(req.params.id);
    // const course = courses.find(c => c.id === courseId);
    // if (!course) return res.status(404).json({ error: "Course not found" });
    // const index = courses.indexOf(course);
    // courses.splice(index, 1);

    try {
        const courseId = await Course.findById(req.params.id);
        if (!courseId) res.status(404).json({ status: httpStatusText.NOT_FOUND, message: { msg: "Course not found" } });

        const course = await Course.deleteOne({ _id: req.params.id });
        res.json({ status: httpStatusText.SUCCESS, data: { course }});
    } catch (error) {
        res.status(404).json({ status: httpStatusText.ERROR, message: error.message, code: 400 });
    }
}


module.exports = {
    getCourses,
    createCourse,
    getSingleCourse,
    updateCourse,
    deleteCourse
}