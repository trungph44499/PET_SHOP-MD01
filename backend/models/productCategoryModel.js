const mongoose = require("mongoose");
const productCategorySchema = new mongoose.Schema({
  img: String,
  name: String,
  status: { type: Boolean, default: true },  
});

const productCategory = mongoose.model("products_categorys",productCategorySchema);
module.exports = productCategory;