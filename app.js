const express = require("express");
const morgan = require("morgan");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
require("colors");

app.use(cors());
app.options("*", cors());

dotenv.config({
    path: "./config/config.env",
});

// Connect to mongodb Server
connectDB();

app.use(
    "/images",
    express.static(path.join(__dirname, "/images"))
);

const api = process.env.API_URL;
const batchRouter = require('./route/batch');
const courseRouter = require('./route/course');
const studentRouter = require('./route/student');

//Middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ urlencoded: true }));

//Routers
app.use(`${api}/batch`, batchRouter);
app.use(`${api}/course`, courseRouter);
app.use(`${api}/student`,studentRouter);


// Display message in home page
app.get("/", (req, res) => {
    res.send("Hello from express");
});

//Server
app.listen(process.env.PORT || 3000, () => {
    console.log("Server running at http://localhost:3000".yellow.underline.bold);
});
