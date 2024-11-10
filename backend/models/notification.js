const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  email: String,
  image: String,
  status: {
    default: "pending",
    type: String,
  },
  service: String,
  type: String,
  date: {
    default: new Date(),
    type: Date,
  },
});

const notificationModel = mongoose.model("notifications", notificationSchema);
module.exports = notificationModel;
