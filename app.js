// app.js

const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./src/db');
const { Feedback, Anonymous, Suggestion, User } = require('./src/models');
const bcrypt = require('bcrypt');
const session = require('express-session');
const dotenv = require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.static("src"));

// Session Middleware
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not defined in .env file");
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Connect to MongoDB
connectDB();

// Middleware to check if user is logged in
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

// Routes
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

app.get("/mainpage", requireLogin, (req, res) => {
  res.sendFile(__dirname + "/views/mainpage.html");
});

app.get("/feedback", requireLogin, (req, res) => {
  res.sendFile(__dirname + "/views/feedback.html");
});

app.get("/suggestion", requireLogin, (req, res) => {
  res.sendFile(__dirname + "/views/suggestion.html");
});

app.get("/anonymous", requireLogin, (req, res) => {
  res.sendFile(__dirname + "/views/anonymous.html");
});

app.post("/feedback", requireLogin, (req, res) => {
  const newFeedback = new Feedback({
    name1: req.body.name1,
    title1: req.body.title1,
    description1: req.body.description1,
  });
  newFeedback.save().then(() => res.redirect("/feedback"));
});

app.post("/anonymous", requireLogin, (req, res) => {
  const newAnonymous = new Anonymous({
    title2: req.body.title2,
    description2: req.body.description2,
  });
  newAnonymous.save().then(() => res.redirect("/anonymous"));
});

app.post("/suggestion", requireLogin, (req, res) => {
  const newSuggestion = new Suggestion({
    name3: req.body.name3,
    title3: req.body.title3,
    description3: req.body.description3,
  });
  newSuggestion.save().then(() => res.redirect("/suggestion"));
});

// Signup Route
app.post('/signup', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Internal server error');
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }

    req.session.user = user;
    res.redirect("/mainpage");
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Error logging in. Please try again.");
  }
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Internal server error");
    }
    res.redirect("/login");
  });
});

// Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
