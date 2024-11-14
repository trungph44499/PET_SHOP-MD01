const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  location: String,
  number: String,
  ship: String,
  paymentMethod: String,
  products: [],
  status: { default: "pending", type: String },//pending,success,reject
});

const paymentModel = mongoose.model("payments", paymentSchema);
module.exports = paymentModel;
