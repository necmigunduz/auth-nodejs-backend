const express = require("express");
const app = express();
const bodyParser = require('body-parser');
// Connect to MongoDB
const dbConnect = require('./db/dbConnect');
dbConnect();
// body parser configuration
app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
let port  = 3000;
app.get("/", (request, response, next) => {
  response.json({ message: `Server is running on Port ${port} ` });
  next();
});


module.exports = app;
