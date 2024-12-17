const express = require("express");
const router = express.Router();
const paymentModel = require("../models/paymentModel");
const notificationModel = require("../models/notification");
const productModel = require("../models/productModel");

router.get("/", async (req, res) => {
  try {
    const result = await paymentModel.find({});
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

router.post("/update", async (req, res) => {
  const { status, id, email, products, idStaff, nameStaff } = req.body;

  try {
    // Kiểm tra nếu status là success
    if (status === "success") {
      for (let index = 0; index < products.length; index++) {
        const product = products[index];
        const queryProduct = await productModel.findById(product.id);
        const sizeToUpdate = queryProduct.size.find(
          (item) => item.sizeName === product.size
        );
    
        if (sizeToUpdate) {
          sizeToUpdate.quantity -= product.quantity;
          
          // Kiểm tra nếu số lượng còn lại của sản phẩm nhỏ hơn hoặc bằng 0
          if (sizeToUpdate.quantity <= 0) {
            return res.status(200).json({
              response: "Số lượng sản phẩm không đủ để thực hiện xác nhận.",
              type: false,
            });
          }
    
          // Cập nhật số lượng đã bán
          queryProduct.sold += product.quantity;
        }
    
        const updateProduct = await productModel.updateMany(
          { _id: product.id },
          {
            size: queryProduct.size,
            sold: queryProduct.sold,
          }
        );
    
        if (updateProduct.matchedCount <= 0) {
          return res.status(200).json({ response: "Cập nhật thông tin thất bại!", type: true });
        }
      }
    }

    const result = await paymentModel.updateMany(
      { _id: id },
      {
        status: status,
        idStaff: idStaff,
        nameStaff: nameStaff,
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

module.exports = router;
