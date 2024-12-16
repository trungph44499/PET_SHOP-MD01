var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");
var multer = require("multer");
var ip = require("../config/ipconfig.json");
const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const moment = require("moment");
const ipconfig = require("../config/ipconfig.json");
const zaloPayModel = require("../models/zalo_payment");
const paymentModel = require("../models/paymentModel");
const notificationModel = require("../models/notification");

router.get("/", function (req, res, next) {
  res.send({ status: 200 });
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const email = req.body.email;
      const dir = path.join(__dirname, "..", "uploads", email);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = Date.now() + ext;
      cb(null, filename);
    },
  }),
});

router.post("/upload", upload.single("avatar"), (req, res) => {
  const file = req.file;
  const email = req.body.email;

  if (!file) {
    return res.status(400).json({ filePath: "", status: false });
  }

  const filePath = `http://${ip.ip}/${email}/${file.filename}`;
  res.status(200).json({ filePath, status: true });
});

const config = {
  appid: "553",
  key1: "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
  key2: "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
  query_zalopay: "https://sb-openapi.zalopay.vn/v2/query",
};

router.post("/order", async function (req, res) {
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

  const embed_data = {
    redirecturl: "http://" + ipconfig.ip + "/callback",
  };
  const transID = Math.floor(Math.random() * 1000000) + "_" + email;

  const order = {
    app_id: config.appid,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: email,
    app_time: Date.now(),
    item: JSON.stringify(products),
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
    const resultInsertPaymentModel = await zaloPayModel.insertMany({
      fullname: fullname,
      email: email,
      location: location,
      number: number,
      ship: ship,
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
      products: products,
    });
    if (resultInsertPaymentModel.length > 0) {
      return res.status(200).json(result.data);
    }
    return res.status(200).json({
      return_code: 0,
      return_message: "Giao dịch không thành công",
      sub_return_code: 0,
      sub_return_message: "Lỗi thanh toán",
      zp_trans_token: "",
      order_url: `http://${ipconfig.ip}`,
      order_token: "",
      qr_code: "",
    });
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
      const getInfoPayment = await zaloPayModel.findOne({ email: email });
      if (getInfoPayment) {
        const result = await paymentModel.insertMany({
          fullname: getInfoPayment.fullname,
          email: getInfoPayment.email,
          location: getInfoPayment.location,
          number: getInfoPayment.number,
          ship: getInfoPayment.ship,
          paymentMethod: getInfoPayment.paymentMethod,
          totalPrice: getInfoPayment.totalPrice,
          products: getInfoPayment.products,
        });
        if (result.length > 0) {
          const resultNotification = await notificationModel.insertMany({
            fullname: getInfoPayment.fullname,
            email: getInfoPayment.email,
            image: getInfoPayment.products[0].image,
            service: getInfoPayment.products[0].name,
            type: `${getInfoPayment.products.length} sản phẩm`,
          });
          if (resultNotification.length > 0) {
            const deleteTempZalo = await zaloPayModel.deleteOne({
              email: email,
            });
            if (deleteTempZalo.deletedCount > 0) {
              status = "Thanh toán thành công";
            }
          }
        }
      }
      res.render('payment', {
        title: status, 
      });
    } catch (error) {
      console.log(error);
    }
  }
});

router.post("/check-status-order", async (req, res) => {
  const { email } = req.body;

  try {
    const resultFindZaloPayment = await zaloPayModel.findOne({ email: email });
    if (!resultFindZaloPayment) {
      return res.status(200).json({ status: 1 });
    }
    return res.status(200).json({ status: 0 });
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

module.exports = router;
