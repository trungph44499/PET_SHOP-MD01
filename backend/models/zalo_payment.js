const mongoose = require("mongoose");
const zaloPaySchema = new mongoose.Schema({
  appid: String,
  apptransid: String,
  bankcode: String,
  pmcid: String,
  amount: String,
  discountamount: String,
  status: String,
  checksum: String,
  email: String,
});

const zaloPayModel = mongoose.model("zalo_payments", zaloPaySchema);
module.exports = zaloPayModel;
