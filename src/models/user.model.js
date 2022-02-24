const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  name: String,
  appKey: String,
  contact: String
});

const User = mongoose.model(
  "User",
  userSchema
);

module.exports = User;