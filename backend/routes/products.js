const express = require("express");
const router = express.Router();
const productModel = require("../models/productModel");

router.get("/", async (req, res) => {
  try {
    const getProducts = await productModel.find({});
    res.status(200).send({ response: getProducts });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
