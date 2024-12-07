const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
  {
    fullname: String,
    email: String,
    location: String,
    number: String,
    ship: String, //Giao hàng nhanh - 15.000đ, Giao hàng COD - 20.000đ
    paymentMethod: String, //Thanh toán khi nhận hàng, Thẻ VISA/MASTERCARD
    totalPrice: Number, // tổng tiền thanh toán
    products: [],
    status: { default: "pending", type: String }, //pending, success, reject, shipping, shipped
  },
  { timestamps: true } // Tạo trường create
);

const paymentModel = mongoose.model("payments", paymentSchema);
module.exports = paymentModel;
