const { User: Student } = require("../model/student");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

// get all users
router.get("/", async (req, res) => {
   return await Student.find({}).select("-password").then(
        (student) => {
            res.status(200).json({
                success: true,
                message : "List of users",
                data: student,
            });
        }
   ).catch(
         (err) => {
                res.status(500).json({
                    success: false,
                    message: err,
                });
            }
   ); // or go to model class and set select:false
});


//Validate upload file
const FILE_TYPE_MAP = {
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/jpg": "jpg",
};

//Upload image to server
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        //validate weather the file is a valid image
        if (!isValid) cb(new Error("Invalid file type"), "./images/user_image");
        else cb(null, "./images/user_image"); // path where we upload an image
    },
    filename: function (req, file, cb) {
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `IMG-${Date.now()}.${extension}`);
    },
});

var uploadOptions = multer({ storage: storage });
// Register user
router.post("/", uploadOptions.single("image"), async (req, res) => {
    const student = new Student({
        fname: req.body.fname,
        lname: req.body.lname,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
    });

    // Add batch to student
    if (req.body.batchId) {
        const batch = await Batch.findById();
        if (!batch) {
            res.status(400).json({
                success: false,
                message: "Invalid batch",
            });
        }else{
            student.batch = batch._id;
        }
    }

    // Add multiple courses to student
    if (req.body.courseId) {
        const courses = await Course
            .find({ _id: { $in: req.body.courseId } });
        if (!courses) {
            res.status(400).json({
                success: false,
                message: "Invalid courses",
            });
        }else{
            student.courses = courses.map((course) => course._id);
        }
    }
   
    // Add image to student
    const file = req.file;
    if (file) {
        const fileName = req.file.filename;
        student.image = '/images/user_image/' + filename;
    }

    await student
        .save()
        .then((createdStudent) => {
            res.status(201).json({
                success: true,
                message : "Student registered successfully",
                data: createdStudent,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: err,
            });
        });
});

router.post('/login', async (req, res) => {
    const student = await Student.findOne({ username: req.body.username });
    const secretKey = process.env.SECRET_KEY;
    if (student) {
        // dont use bcryptjs
        if (bcrypt.compareSync(req.body.password, student.password)) {
            // create a token
            const token = jwt.sign(
                {
                    email: student.email,
                },
                secretKey,
                {
                    expiresIn: "1d",
                }
            );

            res.json({ success: true, token: token });
        } else {
            res
                .status(401)
                .json({
                    success: false,
                    message: "Invalid username or password",
                });
        }
    } else {
        res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
});

router.delete("/:id", async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (student) {
        await student.remove();
        res.json({ success: true });
    } else {
        res.status(404).send("Student not found");
    }
});

module.exports = router;