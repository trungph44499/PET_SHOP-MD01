// routes/cart.js
const express = require("express");
const router = express.Router();
const cartModel = require("../models/cartModel");

router.post("/addToCart", async (req, res) => {
  const { _id, img, name, type, price, origin, size, quantity, description } = req.body;

  try {
    const checkExist = await cartModel.findById(_id);
    if (!checkExist) {
      const result = await cartModel.create({
        _id,
        img,
        name,
        type,
        price,
        origin,
        size,
        quantity,
        description,
      });
      return res.status(200).json({ response: "Thêm sản phẩm thành công", result });
    } else {
      return res.status(200).json({ response: "Sản phẩm đã có trong giỏ hàng!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "Có lỗi xảy ra!" });
  }
});

router.get("/getFromCart", async (req, res) => {
  try {
    const result = await cartModel.find({});
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "Có lỗi xảy ra!" });
  }
});

module.exports = router;
