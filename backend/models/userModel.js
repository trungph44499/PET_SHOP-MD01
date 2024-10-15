const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  pass: String,
  avatar: {
    type: String,
    default:
      "https://i.pinimg.com/474x/6d/50/9d/6d509d329b23502e4f4579cbad5f3d7f.jpg",
  },
  role: String,
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
