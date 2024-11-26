const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  img: String,
  name: String,
  price: Number, // Đây là giá mặc định của sản phẩm (có thể không cần nếu dùng giá theo size)
  quantity: Number,
  size: [{
    sizeName: { 
      type: String, 
      required: true
    },
    price: { 
      type: Number, 
      required: true 
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  status: String,
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products_categorys',
    required: true
  },
  description: String,
  animals: { 
    type: String, 
    enum: ['dog', 'cat'], // Chỉ có thể là "dog" hoặc "cat"
    required: true 
  },
});

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;
