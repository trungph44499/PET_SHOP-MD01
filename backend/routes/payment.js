const express = require("express");
const router = express.Router();
const paymentModel = require("../models/paymentModel");
const notificationModel = require("../models/notification");
const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const moment = require("moment");
const ipconfig = require("../config/ipconfig.json");
const zaloPayModel = require("../models/zalo_payment");

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

router.get("/get-type", async (req, res) => {
  const { email, type } = req.query;

  try {
    const result = await paymentModel.find({ email: email, status: type });
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

router.post("/add", async (req, res) => {
  const {
    fullname,
    email,
    location,
    number,
    ship,
    paymentMethod,
    totalPrice,
    products,
  } = req.body;
  try {
    const result = await paymentModel.insertMany({
      fullname: fullname,
      email: email,
      location: location,
      number: number,
      ship: ship,
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
      products: products,
    });
    if (result.length > 0) {
      const resultNotification = await notificationModel.insertMany({
        fullname: fullname,
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

const config = {
  appid: "553",
  key1: "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
  key2: "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

router.post("/order", async function (req, res) {
  const products = req.body.products;
  const totalPrice = req.body.totalPrice;
  const email = req.body.email;

  const embed_data = {
    redirecturl: "http://" + ipconfig.ip + "/pay/callback",
  };
  const items = products;
  const transID = Math.floor(Math.random() * 1000000) + "_" + email;

  const order = {
    app_id: config.appid,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: email,
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: totalPrice,
    callback_url: "http://" + ipconfig.ip,
    description: `Payment for #${transID}`,
    bank_code: "",
  };
  const data =
    config.appid +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order });
    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error);
  }
});

router.post("/reset", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await zaloPayModel.deleteMany({ email: email });
    res.status(200).json(result.deletedCount);
  } catch (error) {
    console.log(error);
  }
});

router.get("/callback", async (req, res) => {
  const app_trans_id = req.query.apptransid;
  const email = app_trans_id.substring(app_trans_id.lastIndexOf("_") + 1);
  const result = { ...req.query, email: email };
  var status = "Thanh toán không thành công";

  if (result.status == 1) {
    try {
      const insertPayment = await zaloPayModel.insertMany(result);
      if (insertPayment.length > 0) {
        status = "Thanh toán thành công";
      }
    } catch (error) {
      console.log(error);
    }
  }

  res.status(200).send(`<h1>${status}</h1>`);
});

router.post("/check-status-order", async (req, res) => {
  const { email } = req.body;

  try {
    const resultFindZaloPayment = await zaloPayModel.find({ email: email });
    res.status(200).json(...resultFindZaloPayment);
  } catch (error) {
    console.log("lỗi");
    console.log(error);
  }
});

module.exports = router;
