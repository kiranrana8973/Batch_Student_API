const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true,
    },
    lname: {
        type: String,
        required: true,
        trim: true,
    },
    image:{
        type: String,
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
    },
   course : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
   }],
});

exports.Student = mongoose.model("Student", studentSchema);