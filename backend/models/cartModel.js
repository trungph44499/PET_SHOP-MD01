// models/cartModel.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  emailUser: String,
  idProduct: String,
  img: String,
  name: String,
  type: String,
  price: Number,
  quantity: Number,
});

const cartModel = mongoose.model("carts", cartSchema);
module.exports = cartModel;
