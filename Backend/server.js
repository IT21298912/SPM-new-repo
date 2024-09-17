require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");

const authRoutes = require("./routes/userRoutes");
const courseRouter = require("./routes/courses");
const tutorialRouter = require("./routes/tutorials");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

const { routsInit } = require("./controllers/auth.google");
const googleAuth = require("./google.auth");

const app = express();

const csrf = require("csurf");

const PORT = process.env.PORT || 8080;

app.use(helmet()); // Adds various HTTP headers
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(","), // Restrict CORS to specific origins
    optionsSuccessStatus: 200,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100
});
app.use(limiter);

// Redirect all HTTP requests to HTTPS
// app.use((req, res, next) => {
//   if (req.header('x-forwarded-proto') !== 'https') {
//     res.redirect(`https://${req.header('host')}${req.url}`);
//   } else {
//     next();
//   }
// });

app.use(bodyParser.json());

const URI = process.env.MONGODB_URL;

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use a strong
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: URI }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true, // Mitigate XSS attacks
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB!!!");
    app.listen(PORT, () => {
      console.log(`Server is up and running on port ${PORT}`);
      routsInit(app, passport);
      googleAuth(passport);
    });
  })
  .catch((error) => {
    console.log("Error Connecting MongoDb", error);
  });

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// CSRF error handler
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    // CSRF token error
    res.status(403).json({ message: "Invalid CSRF token" });
  } else {
    next(err);
  }
});

app.use("/auth", authRoutes);
app.use("/courses", courseRouter);
app.use("/tutorials", tutorialRouter);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Server static files
app.use(
  "/TuteFiles",
  express.static(path.join(__dirname, "TuteFiles"), {
    dotfiles: "deny", // Deny dotfiles
    index: false, // Disable directory indexing
  })
);

// Global errors handle
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
