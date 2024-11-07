const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
  email: String,
  location: String,
  number: String,
  products: [],
  status: { default: false, type: Boolean },
});

const paymentModel = mongoose.model("payments", paymentSchema);
module.exports = paymentModel;
