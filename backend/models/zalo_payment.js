const mongoose = require("mongoose");
const zaloPaySchema = new mongoose.Schema({
  fullname: String,
  email: String,
  location: String,
  number: String,
  ship: String,
  paymentMethod: String,
  totalPrice: Number,
  products: [],
});

const zaloPayModel = mongoose.model("zalo_payments", zaloPaySchema);
module.exports = zaloPayModel;
