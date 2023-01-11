const { Batch } = require("../model/batch");
const express = require("express");
const router = express.Router();

// get all batches
router.get("/", (req, res) => {
    Batch.find({}).then(
        (batch) => {
            res.status(200).json({
                success: true,
                message: "List of batches",
                data: batch,
            });
        }).catch(
            (err) => {
                res.status(500).json({
                    success: false,
                    message: err,
                });
            }
        ); // or go to model class and set select:false
});

// Add batch
router.post("/", (req, res) => {
    const batch = new Batch({
        batchName: req.body.batchName,
    });
    batch.save().then(
        (batch) => {
            res.status(200).json({
                success: true,
                message: "Batch added successfully",
                data: batch,
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
