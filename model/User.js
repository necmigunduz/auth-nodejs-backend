const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter a username"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email adress"],
  },
  phone: {
    type: String,
    required: [true, "Please enter a phone number"],
  },
  confirmationCode: {
    type: String
  },
  status: {
    type: String, 
    enum: ['Pending', 'Active'],
    default: 'Pending'
  }
});

module.exports = mongoose.model("User", UserSchema);
