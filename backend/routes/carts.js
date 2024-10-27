const express = require("express");
const router = express.Router();
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel"); 

// Thêm sản phẩm vào giỏ hàng
router.post("/addToCart", async (req, res) => {
  const {
    emailUser,
    _id: idProduct,
    img,
    name,
    type,
    price,
    quantity = 1, // Mặc định là 1 nếu không có giá trị
  } = req.body;

  if (!emailUser || !idProduct || !img || !name || !type || !price) {
    return res.status(200).json({ response: "Thiếu thông tin cần thiết!" });
  }

  try {
    const existingItem = await cartModel.findOne({
      idProduct: idProduct,
      emailUser: emailUser,
    });

    if (existingItem) {
      return res.status(200).json({ response: "Sản phẩm đã có trong giỏ hàng!" });
    } else {
      const newItem = await cartModel.create({
        emailUser,
        idProduct,
        img,
        name,
        type,
        price,
        quantity,
      });
      return res.status(200).json({ response: "Thêm sản phẩm thành công", result: newItem });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "Có lỗi xảy ra!" });
  }
});

// Lấy sản phẩm từ giỏ hàng
router.get("/getFromCart", async (req, res) => {
  const { emailUser } = req.query;

  try {
    const result = await cartModel.find({ emailUser: emailUser });
    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ response: "Có lỗi xảy ra!" });
  }
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/removeFromCart/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await cartModel.findByIdAndDelete(id);
    if (result) {
      return res.status(200).json({ response: "Sản phẩm đã được xóa khỏi giỏ hàng!" });
    } else {
      return res.status(404).json({ response: "Không tìm thấy sản phẩm!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "Có lỗi xảy ra!" });
  }
});

// Xóa tất cả sản phẩm trong giỏ hàng theo email
router.delete("/removeAllFromCart/:emailUser", async (req, res) => {
  const { emailUser } = req.params;

  try {
    await cartModel.deleteMany({ emailUser: emailUser });
    return res.status(200).json({ response: "Đã xóa tất cả sản phẩm khỏi giỏ hàng!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "Có lỗi xảy ra!" });
  }
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/updateQuantity/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  // Kiểm tra xem quantity có được cung cấp không
  if (quantity === undefined) {
    return res.status(400).json({ response: "Thiếu thông tin số lượng!" });
  }

  try {
    const item = await cartModel.findById(id);
    if (!item) {
      return res.status(404).json({ response: "Không tìm thấy sản phẩm!" });
    }

    if (quantity < 1) {
      return res.status(400).json({ response: "Số lượng phải lớn hơn 0!" });
    }

    const product = await productModel.findById(item.idProduct);
    if (!product) {
      return res.status(404).json({ response: "Không tìm thấy sản phẩm trong cơ sở dữ liệu!" });
    }

    if (quantity > product.quantity) {
      return res.status(400);
    }

    // Cập nhật số lượng
    item.quantity = quantity;
    await item.save();

    return res.status(200).json({ response: "Cập nhật số lượng thành công!", result: item });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "Có lỗi xảy ra!" });
  }
});


module.exports = router;