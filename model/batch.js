const mongoose = require('mongoose');

const batchSchema = mongoose.Schema({
    batchName: {
        type: String,
        required: true,
        trim: true,
    }
}); 

exports.Batch = mongoose.model("Batch", batchSchema);