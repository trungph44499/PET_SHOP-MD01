const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  img: String,
  name: String,
  price: String,  
  origin: String,
  quantity: Number,
  status: String,
  type: String,
  description: String,
});

const productModel = mongoose.model("products",productSchema);
module.exports = productModel;