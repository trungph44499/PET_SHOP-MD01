const express = require("express");
const router = express.Router();
const cartModel = require("../models/cartModel");

router.post("/addToCart", async (req, res) => {
  const { _id, img, name, type, price, origin, size, quantity, description } =
    req.body;

  try {
    const checkExist = await cartModel.findById(_id);
    if (checkExist == null) {
      const result = await cartModel.insertMany({
        _id: _id,
        img: img,
        name: name,
        type: type,
        price: price,
        origin: origin,
        size: size,
        quantity: quantity,
        description: description,
      });
      result.length != 0
        ? res.status(200).json({ response: "Insert complete!" })
        : res.status(200).json({ response: "Error insert!" });
    } else {
      res.status(200).json({ response: "Item already exists!" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/getFromCart", async (req, res) => {
  try {
    const result = await cartModel.find({});
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
