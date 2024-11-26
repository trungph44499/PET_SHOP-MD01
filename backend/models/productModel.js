const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  img: String,
  name: String,
  size: [
    {
      sizeName: String,   // Tên kích thước (ví dụ: "S", "M", "L")
      price: Number,      // Giá của sản phẩm cho kích thước đó
      quantity: Number,   // Số lượng của sản phẩm cho kích thước đó
    }
  ],
  status: String,
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products_categorys',
    required: true
  }, // Tham chiếu đến productCategories
  description: String,
  animals: { 
    type: String, 
    enum: ['dog', 'cat'], // Chỉ có thể là "dog" hoặc "cat"
    required: true 
  }, // Phân loại sản phẩm cho chó hoặc mèo
});

const productModel = mongoose.model("products", productSchema);
module.exports = productModel;