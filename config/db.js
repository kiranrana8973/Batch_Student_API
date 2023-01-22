const mongoose = require('mongoose');
require('colors');
// Mongoose will ensure that only the fields that are specified in your Schema will be saved in the database,
// and all other fields will not be saved
mongoose.set('strictQuery', true);
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.CONNECTION_STRING);
  console.log(
    `MongoDB connected to : ${conn.connection.host}`.cyan.underline.bold
  );
};

module.exports = connectDB;
