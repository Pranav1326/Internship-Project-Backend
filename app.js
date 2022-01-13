// Dependecies
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// DB
const dbConnect = require('./db/dbConnect');
dbConnect();

// User model
const User = require('./db/userModel');

// Auth route
const auth = require('./auth');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res, next) => {
    res.json({message: "This is response from the server."});
    next();
});

app.post('/register', (req, res) => {
    const saltValue = 10;
    bcrypt.hash(req.body.password, saltValue)
      .then((hashedPassword) => {
        // Creating a new user from user Schema.
        const user = new User({
          email: req.body.email,
          password: hashedPassword
        });
  
        // Saving user into db.
        user.save().then((result) => {
          res.status(201).send({
            message: 'User created Successfully.',
            result,
          });
        })
        // Will show error if user's data is not able to save.
        .catch((err) => {
          res.status(500).send({
            message: 'Error creating User.',
            err,
          });
        });
    })
    // Will show error if given password is incorrect.
    .catch((e) => {
        res.status(500).send({
        message: 'Password was not hashed.',
        e
    });
    });
});

app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email })
    // If email (user) exists
    .then((user) => {
      bcrypt.compare(req.body.password, user.password)
        .then((passwordCheck) => {
          if(!passwordCheck){
            return response.status(400).send({
              message: 'Password does not match!',
              error
            });
          }
          // Creates JWT token.
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            {expiresIn: "5m"}
          );
          // Return success response.
          res.status(200).send({
            message: 'Login Successful',
            token,
          });
        })
        // Catch Error if password does not match.
        .catch((err) => {
          res.status(400).send({
            message: 'Password does not match!',
            err,
          });
        });
    })
    // Catch error if email does not exist.
    .catch((err) => {
        console.log(res.status(404).send({
            message: 'Email not found!',
            err
        }));
    });
});

app.get("/auth-endpoint",auth, (req, res) => {
    res.json({ message: "You are authorized to access me" });
});

// Curb Cores Error by adding a header here
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

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});