// src/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'unifeedback'  // Specify the database name here
    });
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
};

module.exports = connectDB;



