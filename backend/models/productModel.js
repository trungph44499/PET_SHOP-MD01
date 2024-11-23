const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  img: String,
  name: String,
  price: Number,
  quantity: Number,
  size: [String],
  status: String,
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products_categorys',
    required: true
  }, // Tham chiếu đến productCategories
  description: String,
});

const productModel = mongoose.model("products", productSchema);
module.exports = productModel;