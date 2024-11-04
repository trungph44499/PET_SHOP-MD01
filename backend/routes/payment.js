const express = require("express");
const router = express.Router();
const paymentModel = require("../models/paymentModel");

router.get("/", async (req, res) => {
  try {
    const result = await paymentModel.find({});
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

router.post("/update", async (req, res) => {
  const { status, id } = req.body;
  try {
    const result = await paymentModel.updateMany(
      {  _id: id },
      {
        status: status,
      }
    );
    if (result.matchedCount > 0) {
      res.status(200).json({ response: "Update status complete!", type: true });
      return;
    }
    res.status(200).json({ response: "Update status failed!", type: false });
  } catch (error) {
    console.log(error);
  }
});

router.get("/filter", async (req, res) => {
  const { email } = req.query;
  try {
    const result = await paymentModel.find({ email: email });
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

router.post("/add", async (req, res) => {
  const { email, location, number, products } = req.body;
  try {
    const result = await paymentModel.insertMany({
      email: email,
      location: location,
      number: number,
      products: products,
    });
    if (result.length > 0) {
      res
        .status(200)
        .json({ response: "Send payment comfirm complete!", type: true });
      return;
    }
    res
      .status(200)
      .json({ response: "Send payment comfirm failed!", type: false });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
