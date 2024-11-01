const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  pass: String,
  sdt: String,
  avatar: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;