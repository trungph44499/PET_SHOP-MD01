const express = require("express");
const router = express.Router();
const paymentModel = require("../models/paymentModel");
const notificationModel = require("../models/notification");

router.get("/", async (req, res) => {
  try {
    const result = await paymentModel.find({});
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

router.post("/update", async (req, res) => {
  const { status, id, email, products } = req.body;
  
  try {
    const result = await paymentModel.updateMany(
      { _id: id },
      {
        status: status,
      }
    );
    if (result.matchedCount > 0) {
      const resultNotification = await notificationModel.insertMany({
        email: email,
        image: products[0].image,
        service: products[0].name,
        status: status,
        type: `${products.length} sản phẩm`,
      });

      if (resultNotification.length > 0) {
        res
          .status(200)
          .json({ response: "Update status complete!", type: true });
        return;
      }
      res.status(200).json({ response: "Update status failed!", type: false });
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
      const resultNotification = await notificationModel.insertMany({
        email: email,
        image: products[0].image,
        service: products[0].name,
        type: `${products.length} sản phẩm`,
      });
      if (resultNotification.length > 0) {
        res
          .status(200)
          .json({ response: "Gửi yêu cầu thành công!", type: true });
        return;
      }
      res.status(200).json({ response: "Gửi yêu cầu thất bại!", type: false });
      return;
    }
    res.status(200).json({ response: "Gửi yêu cầu thất bại!", type: false });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
