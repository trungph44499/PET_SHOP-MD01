const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  img: String,
  name: String,
  price: Number,
  origin: String,
  quantity: Number,
  weight: String,
  sex: {  // Thêm trường sex
    type: String,
    enum: ['Male', 'Female', 'Unisex'],  // Các giá trị có thể có
    required: true,  // Bắt buộc nhập
  },
  status: String,
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products_categorys', required: true
  }, // Tham chiếu đến productCategories
  description: String,
});

const productModel = mongoose.model("products", productSchema);
module.exports = productModel;