// Dependecies
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// DB
const dbConnect = require('./db/dbConnect');
dbConnect();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res, next) => {
    res.json({message: "This is response from the server."});
    next();
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});