const mongoose = require("mongoose");

const UserDataSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide Username!"],
    unique: [true, "User Exist!"],
  },
  cellnumber: {
    type: Number,
    min: 10,
    max: 10,
    required: [true, "Please provide mobile number!"],
  },
  email: {
    type: String,
    unique: [true, "Email Exist!"],
    required: [true, "Please provide Email!"],
  },
  address: {
    type: String,
    required: [true, "Please provide Address!"],
  },
});

module.exports =
  mongoose.model.UserData || mongoose.model("userData", UserDataSchema);
