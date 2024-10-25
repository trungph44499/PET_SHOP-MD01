const express = require("express");
const router = express.Router();
const cartModel = require("../models/cartModel");

// Thêm sản phẩm vào giỏ hàng
router.post("/addToCart", async (req, res) => {
  const {
    emailUser,
    _id: idProduct,
    img,
    name,
    type,
    price,
    origin,
    size,
    quantity,
    description,
  } = req.body;

  try {
    const existingItem = await cartModel.findOne({
      idProduct: idProduct,
      emailUser: emailUser,
    });

    if (existingItem) {
      // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).json({ response: "Cập nhật số lượng sản phẩm thành công", result: existingItem });
    } else {
      const newItem = await cartModel.create({
        emailUser,
        idProduct,
        img,
        name,
        type,
        price,
        origin,
        size,
        quantity,
        description,
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

  try {
    const updatedItem = await cartModel.findByIdAndUpdate(id, { quantity }, { new: true });
    if (updatedItem) {
      return res.status(200).json({ response: "Cập nhật số lượng thành công!", result: updatedItem });
    } else {
      return res.status(404).json({ response: "Không tìm thấy sản phẩm!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "Có lỗi xảy ra!" });
  }
});

// Tăng số lượng sản phẩm trong giỏ hàng
router.patch("/increaseQuantity/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const item = await cartModel.findById(id);
    if (item) {
      item.quantity += 1; // Tăng số lượng lên 1
      await item.save();
      return res.status(200).json({ response: "Tăng số lượng thành công!", result: item });
    } else {
      return res.status(404).json({ response: "Không tìm thấy sản phẩm!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "Có lỗi xảy ra!" });
  }
});

// Giảm số lượng sản phẩm trong giỏ hàng
router.patch("/decreaseQuantity/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const item = await cartModel.findById(id);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1; // Giảm số lượng xuống 1
        await item.save();
        return res.status(200).json({ response: "Giảm số lượng thành công!", result: item });
      } else {
        return res.status(400).json({ response: "Số lượng không thể giảm xuống 0!" });
      }
    } else {
      return res.status(404).json({ response: "Không tìm thấy sản phẩm!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "Có lỗi xảy ra!" });
  }
});

module.exports = router;
