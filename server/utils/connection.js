require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");

mongoose.connect(process.env.ATLAS_URI)

const noteSchema = new mongoose.Schema({
  text: String,
  pinned: Boolean,
  editedAt: String
})

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  notes: [noteSchema]
})

module.exports.UserModel = mongoose.model("users", userSchema);