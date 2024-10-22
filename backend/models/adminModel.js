const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  fullname: String,
  username: String,
  password: String,
  type: String,
  status: Boolean,
});

const adminModel = mongoose.model("admins", adminSchema);
module.exports = adminModel;
