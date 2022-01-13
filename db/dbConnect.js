const mongoose = require('mongoose');
require('dotenv').config();

async function dbConnect() {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connect to MongoDB Atlas.");
    })
    .catch((err) => {
        console.log("Unable to connect to MongoDb Atlas!");
        console.log(err);
    });
}

module.exports = dbConnect;