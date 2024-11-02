const express = require("express");
const petCareModel = require("../models/petCareModel");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { service, name, email, phone, message } = req.body;
  try {
    const result = await petCareModel.insertMany({
      service: service,
      name: name,
      email: email,
      phone: phone,
      message: message,
    });
    if (result.length > 0) {
      res.status(200).json({ response: "Post require completed", type: true });
      return;
    }
    res.status(200).json({ response: "Post require failed", type: false });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await petCareModel.find({});
    res.status(200).send({ response: result });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
