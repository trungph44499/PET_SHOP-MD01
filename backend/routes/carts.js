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
      return res
        .status(200)
        .json({ response: "Sản phẩm đã có trong giỏ hàng!" });
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
      return res
        .status(200)
        .json({ response: "Thêm sản phẩm thành công", result: newItem });
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
// Xóa tất cả sản phẩm được lựa chọn trong giỏ hàng

router.post("/removeAllFromCart", async (req, res) => {
  const { list, emailUser } = req.body;
  var itemDelete = 0;

  try {
    for (const item of list) {
      const result = await cartModel.deleteMany({
        idProduct: item.id,
        emailUser: emailUser,
      });
      itemDelete += result.deletedCount;
    }

    if (itemDelete > 0) {
      return res.status(200).json({
        response: "Tất cả sản phẩm được chọn đã xóa khỏi giỏ hàng!",
        type: true,
      });
    }
    return res
      .status(200)
      .json({ response: "Không tìm thấy sản phẩm!", type: false });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "Có lỗi xảy ra!", type: false });
  }
});

// Xóa sản phẩm khỏi giỏ hàng
router.post("/removeFromCart", async (req, res) => {
  const { id } = req.body;

  try {
    const result = await cartModel.deleteOne({ idProduct: id });
    if (result != null) {
      return res.status(200).json({
        response: "Đã xóa sản phẩm khỏi giỏ hàng!",
        type: true,
      });
    }
    return res.status(200).json({ response: "Lỗi xóa sản phẩm!", type: false });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "Có lỗi xảy ra!", type: false });
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
    const product = await productModel.findById(item.idProduct);
    if (!item) {
      return res.status(404).json({ response: "Không tìm thấy sản phẩm!" });
    }

    if (quantity < 1) {
      return res.status(400).json({ response: "Số lượng phải lớn hơn 0!" });
    }

    if (!product) {
      return res
        .status(404)
        .json({ response: "Không tìm thấy sản phẩm trong cơ sở dữ liệu!" });
    }

    if (quantity > product.quantity) {
      return res.status(400);
    }

    // Cập nhật số lượng
    item.quantity = quantity;
    await item.save();

    return res
      .status(200)
      .json({ response: "Cập nhật số lượng thành công!", result: item });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "Có lỗi xảy ra!" });
  }
});

module.exports = router;
