const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDB;
