// const { Schema, model } = require("mongoose");

// const userSchema = new Schema({
//   first_name: { type: String, default: null },
//   last_name: { type: String, default: null },
//   email: { type: String, unique: true },
//   password: { type: String },
//   token: { type: String },
//   phone: { type: String },
//   address: { type: String },
//   user_type: {
//     type: String,
//     enum: ["Admin", "Worker", "Member"],
//   },
//   added_by: {
//     type: Schema.Types.ObjectId,
//     ref: "user",
//     required: true,
//   },
// });

// module.exports = model("user", userSchema);




const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
  phone: { type: String },
  address: { type: String },
  user_type: {
    type: String,
    enum: ["Admin", "Worker", "Member"],
  },
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Change the reference name to "User" (uppercase U)
    required: true,
  },
});

const User = mongoose.model("User", userSchema); // Change the model name to "User" (uppercase U)

module.exports = User; // Export the User model
