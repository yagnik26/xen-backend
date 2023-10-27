const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Connected");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDB;
