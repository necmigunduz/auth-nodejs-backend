const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("./model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Connect to MongoDB
const dbConnect = require("./db/dbConnect");
dbConnect();
// Handle Cors Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let port = 8080;
app.get("/", (request, response, next) => {
  response.json({ message: `Server is running on Port ${port} ` });
  next();
});
// Signup endpoint
app.post("/signup", (req, res) => {
  // Create token
  const token = jwt.sign({email: req.body.email}, process.env.JWT_SECRET);
  // Create user
  bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: hashedPassword,
        confirmationCode: token,
      });

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          res.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
          res.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      res.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

// Login endpoint with phone number and password
app.post("/login", (request, response) => {
  // check if phone exists
  User.findOne({ phone: request.body.phone })

    // if phone exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((phoneCheck) => {
          // check if password matches
          if (!phoneCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }
          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userPhone: user.phone,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login is successful!",
            status: user.status,
            phone: user.phone,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if phone does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Phone number not found",
        e,
      });
    });
});
// Export
module.exports = app;
