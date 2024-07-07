// src/models.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name1: {
    type: String,
    required: true,
  },
  title1: {
    type: String,
    required: true,
  },
  description1: {
    type: String,
    required: true,
  },
}, { collection: 'feedback' }); // Specify the existing collection name

const anonymousSchema = new mongoose.Schema({
  title2: {
    type: String,
    required: true,
  },
  description2: {
    type: String,
    required: true,
  },
}, { collection: 'anonymous' }); // Specify the existing collection name

const suggestionSchema = new mongoose.Schema({
  name3: {
    type: String,
    required: true,
  },
  title3: {
    type: String,
    required: true,
  },
  description3: {
    type: String,
    required: true,
  },
}, { collection: 'suggestion' }); // Specify the existing collection name


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { collection: 'users' });

const Feedback = mongoose.model("Feedback", feedbackSchema);
const Anonymous = mongoose.model("Anonymous", anonymousSchema);
const Suggestion = mongoose.model("Suggestion", suggestionSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Feedback, Anonymous, Suggestion, User };




