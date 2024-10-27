const express = require("express");
const router = express.Router();
const confirmProductModel = require("../models/confirmProduct");

router.post("/confirm-product", async (req, res) => {
  const { email, id } = req.body;
  try {
    const result = await confirmProductModel.updateOne(
      {
        _id: id,
        emailUser: email,
      },
      {
        status: true,
      }
    );
    if (result != null) {
      res
        .status(200)
        .json({ response: "Confirm product complete", type: true });
      return;
    }
    res.status(200).json({ response: "Confirm product error", type: false });
  } catch (error) {
    console.log(error);
  }
});

router.post("/post-confirm", async (req, res) => {
  const { email, products } = req.body;

  try {
    const result = await confirmProductModel.insertMany({
      emailUser: email,
      products: products,
    });
    if (result.length > 0) {
      res.status(200).json({ response: "Post comfirm complete", type: true });
      return;
    }
    res.status(200).json({ response: "Post comfirm error", type: false });
  } catch (error) {
    console.log(error);
  }
});

router.post("/get-history-buy-product", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await confirmProductModel.find({ emailUser: email });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await confirmProductModel.find({});
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
