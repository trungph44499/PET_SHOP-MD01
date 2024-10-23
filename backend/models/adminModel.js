const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  fullname: String,
  username: String,
  password: String,
  type: { default: 'staff', type: String },
  status: { default: true, type: Boolean },
});

const adminModel = mongoose.model("admins", adminSchema);
module.exports = adminModel;
