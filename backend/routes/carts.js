// routes/cart.js
const express = require("express");
const router = express.Router();
const cartModel = require("../models/cartModel");

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
    const checkExist = await cartModel.find({
      idProduct: idProduct,
      emailUser: emailUser,
    });
    
    if (checkExist.length <= 0) {
      const result = await cartModel.create({
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
      return res
        .status(200)
        .json({ response: "Thêm sản phẩm thành công", result });
    }
    return res.status(200).json({ response: "Sản phẩm đã có trong giỏ hàng!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "Có lỗi xảy ra!" });
  }
});

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

module.exports = router;
