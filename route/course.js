const { Course } = require("../model/course");
const express = require("express");
const router = express.Router();

// get all courses
router.get("/", (req, res) => {
    return Course.find({}).then(
        (course) => {
            res.status(200).json({
                success: true,
                message: "List of courses",
                data: course,
            });
        }
    ).catch(
        (err) => {
            res.status(500).json({
                success: false,
                message: err,
            });
        }
    );
});

// Add course
router.post("/", (req, res) => {
    const course = new Course({
        courseName: req.body.courseName,
    });
    course.save().then(
        (course) => {
            res.status(200).json({
                success: true,
                message: "Course added successfully",
                data: course,
            });
        }
    ).catch(
        (err) => {
            res.status(500).json({
                success: false,
                message: err,
            });
        }
    );
});

module.exports = router;