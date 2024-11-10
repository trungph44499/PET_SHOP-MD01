const express = require("express");
const petCareModel = require("../models/petCareModel");
const notificationModel = require("../models/notification");
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
      const resultNotification = await notificationModel.insertMany({
        email: email,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_yA01hlkbakXKrF5TqzhZDHStKIzYIbahFA&s",
        service: "Pet Care",
        type: service,
      });
      if (resultNotification.length > 0) {
        res
          .status(200)
          .json({ response: "Đăng ký dịch vụ thành công", type: true });
        return;
      }
      res
        .status(200)
        .json({ response: "Đăng ký dịch vụ thất bại", type: true });
      return;
    }
    res.status(200).json({ response: "Đăng ký dịch vụ thất bại", type: false });
  } catch (error) {
    console.log(error);
  }
});

router.post("/update", async (req, res) => {
  const { service, id, email, status } = req.body;
  try {
    const result = await petCareModel.updateMany(
      { _id: id },
      {
        status: status,
      }
    );
    if (result.matchedCount > 0) {
      const resultNotification = await notificationModel.insertMany({
        email: email,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_yA01hlkbakXKrF5TqzhZDHStKIzYIbahFA&s",
        service: "Pet Care",
        type: service,
        status: status,
      });
      if (resultNotification.length > 0) {
        res
          .status(200)
          .json({ response: "Cập nhật dịch vụ thành công", type: true });
        return;
      }
      res
        .status(200)
        .json({ response: "Cập nhật dịch vụ thất bại", type: true });
      return;
    }
    res
      .status(200)
      .json({ response: "Cập nhật dịch vụ thất bại", type: false });
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
