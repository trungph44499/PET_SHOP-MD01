const express = require("express");
const mongoose = require("mongoose"); // Đảm bảo bạn import mongoose
const router = express.Router();
const productModel = require("../models/productModel");

// Lấy tất cả sản phẩm
router.get("/", async (req, res) => {
  try {
    const getProducts = await productModel.find({}).populate("type", "name"); // Populate trường 'name' từ 'productCategory'
    res.status(200).send({ response: getProducts });
  } catch (error) {
    console.log(error);
    res.status(500).send({ response: "Có lỗi xảy ra!" });
  }
});

// Lấy thông tin sản phẩm theo ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productModel.findById(id).populate("type", "name");
    if (product) {
      res.status(200).json({ response: product });
    } else {
      res.status(404).json({ response: "Không tìm thấy sản phẩm!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "Có lỗi xảy ra!" });
  }
});

// Thêm mới sản phẩm
router.post("/add", async (req, res) => {
  const { image, name, size, status, type, description, animals } = req.body;

  // Chuyển đổi chuỗi size thành mảng đối tượng
  const sizeArray = size.map((item) => ({
    sizeName: item.sizeName, // Ví dụ: "S", "M", "L"
    price: item.price, // Giá của kích thước đó
    quantity: item.quantity, // Số lượng của kích thước đó
  }));

  try {
    // Kiểm tra type có phải là ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(type)) {
      return res.status(400).json({ response: "ID danh mục không hợp lệ!" });
    }

    const newProduct = new productModel({
      img: image,
      name: name,
      size: sizeArray,
      status: status,
      type: type, // Đây là ObjectId tham chiếu đến danh mục
      description: description,
      animals: animals,
    });

    const savedProduct = await newProduct.save();
    res.status(200).json({
      response: "Thêm sản phẩm thành công!",
      type: true,
      product: savedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "Lỗi thêm sản phẩm!" });
  }
});

// Cập nhật sản phẩm
router.post("/update", async (req, res) => {
  const { id, image, name, size, status, type, description, animals } =
    req.body;

  // Chuyển đổi chuỗi size thành mảng đối tượng
  const sizeArray = size.map((item) => ({
    sizeName: item.sizeName, // Ví dụ: "S", "M", "L"
    price: item.price, // Giá của kích thước đó
    quantity: item.quantity, // Số lượng của kích thước đó
  }));

  try {
    // Kiểm tra type có phải là ObjectId hợp lệ không
    if (type && !mongoose.Types.ObjectId.isValid(type)) {
      return res.status(400).json({ response: "ID danh mục không hợp lệ!" });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        img: image,
        name: name,
        size: sizeArray,
        status: status,
        type: type, // Cập nhật trường type
        description: description,
        animals: animals,
      },
      { new: true }
    ); // Trả về bản cập nhật mới

    if (updatedProduct) {
      res.status(200).json({
        response: "Cập nhật sản phẩm thành công!",
        type: true,
        product: updatedProduct,
      });
    } else {
      res.status(400).json({ response: "Lỗi cập nhật sản phẩm!", type: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "Có lỗi xảy ra!" });
  }
});

// Xóa sản phẩm
router.post("/delete", async (req, res) => {
  const { id } = req.body;

  try {
    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ response: "Sản phẩm không tồn tại!" });
    }

    const deleteProduct = await productModel.deleteOne({ _id: id });
    if (deleteProduct.deletedCount > 0) {
      res
        .status(200)
        .json({ response: "Xóa sản phẩm thành công!", type: true });
    } else {
      res.status(200).json({ response: "Lỗi xóa sản phẩm!", type: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "Có lỗi xảy ra!" });
  }
});

module.exports = router;
