// Dependecies
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// DB
const dbConnect = require("./db/dbConnect");
dbConnect();

// User model
const User = require("./db/userModel");

// User-data model
const UserData = require("./db/userDataModel");

// Auth route
const auth = require("./auth");
const { Mongoose, mongo } = require("mongoose");
const userModel = require("./db/userModel");
const userDataModel = require("./db/userDataModel");

const app = express();
const port = process.env.PORT || 3030;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/home", auth, (req, res) => {
  userDataModel.find({}, (err, result) => {
    if (!err) {
      res.status(200).send({ users: result });
    } else {
      res.status(404).send("Error finding data: " + err);
    }
  });
});

app.get("/delete/(:id)", (req, res) => {
  userDataModel.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) {
      console.log("Error deleting user: " + err);
    } else {
      res.send(user);
    }
  });
});

app.post("/user-register", (req, res) => {
  // Creating a new user's data from userData Schema.
  const userData = new UserData({
    username: req.body.username,
    cellnumber: req.body.cellnumber,
    email: req.body.email,
    address: req.body.address,
  });

  // Saving user into db.
  userData
    .save()
    .then((result) => {
      res.status(201).send({
        message: "User created Successfully.",
        result,
      });
    })
    // Will show error if user's data is not able to save.
    .catch((err) => {
      res.status(500).send({
        message: "Error creating User.",
        err,
      });
    });
});

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    // If email (user) exists
    .then((user) => {
      bcrypt
        .compare(req.body.password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Password does not match!",
              error,
            });
          }
          // Creates JWT token.
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "5m" }
          );
          // Return success response.
          res.status(200).send({
            message: "Login Successful",
            token,
          });
        })
        // Catch Error if password does not match.
        .catch((err) => {
          res.status(400).send({
            message: "Password does not match!",
            err,
          });
        });
    })
    // Catch error if email does not exist.
    .catch((err) => {
      console.log(
        res.status(404).send({
          message: "Email not found!",
          err,
        })
      );
    });
});

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", [
    "https://peaceful-ardinghelli-fc4397.netlify.app/",
    "https://peaceful-ardinghelli-fc4397.netlify.app/login",
    "https://peaceful-ardinghelli-fc4397.netlify.app/home",
    "https://peaceful-ardinghelli-fc4397.netlify.app/register",
  ]);
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

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
