const express = require("express");
const notificationModel = require("../models/notification");
const router = express.Router();

router.post("/add", async function (req, res) {
  const { email, image, service, type } = req.body;
  try {
    const result = await notificationModel.insertMany({
      email: email,
      image: image,
      service: service,
      type: type,
      date: Date.now(),
    });

    if (result.length > 0) {
      res.status(200).json(true);
      return;
    }
    res.status(200).json(false);
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async function (req, res) {
  const { email } = req.query;
  try {
    const result = await notificationModel.find({
      email: email,
    });

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
