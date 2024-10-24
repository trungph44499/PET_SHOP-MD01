const express = require("express");
const router = express.Router();
const productModel = require("../models/productModel");
const typeProductModel = require("../models/typeProductModel");

router.get("/", async (req, res) => {
  const arrayResult = [];
  try {
    const getProducts = await productModel.find({});
    const getTypeProduct = await typeProductModel.find({});

    getProducts.map((item) => {
      getTypeProduct.map((type) => {
        if (item.type == type._id) {
          item.type = type.type;
          arrayResult.push(item);
        }
      });
    });

    res.status(200).send({ response: arrayResult });
  } catch (error) {
    console.log(error);
  }
});

router.post("/add", async (req, res) => {
  var img = req.body.image ?? "";
  var name = req.body.name ?? "";
  var price = req.body.price ?? "";
  var origin = req.body.origin ?? "";
  var quantity = req.body.quantity ?? "";
  var status = req.body.status ?? "";
  var type = req.body.type ?? "";
  var description = req.body.description ?? "";

  try {
    const addProduct = await productModel.insertMany({
      img: img,
      name: name,
      price: price,
      origin: origin,
      quantity: quantity,
      status: status,
      type: type,
      description: description,
    });

    if (addProduct.length > 0) {
      res.status(200).json({ response: "Add product complete!", type: true });
    } else {
      res.status(200).json({ response: "Error add product!", type: false });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/update", async (req, res) => {
  var id = req.body.id;
  var img = req.body.image ?? "";
  var name = req.body.name ?? "";
  var price = req.body.price ?? "";
  var origin = req.body.origin ?? "";
  var quantity = req.body.quantity ?? "";
  var status = req.body.status ?? "";
  var type = req.body.type ?? "";
  var description = req.body.description ?? "";

  try {
    const updateProduct = await productModel.findByIdAndUpdate(id, {
      img: img,
      name: name,
      price: price,
      origin: origin,
      quantity: quantity,
      status: status,
      type: type,
      description: description,
    });

    if (updateProduct != null) {
      res
        .status(200)
        .json({ response: "Update product complete!", type: true });
    } else {
      res.status(200).json({ response: "Error Update product!", type: false });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete", async (req, res) => {
  var id = req.body.id;

  try {
    const deleteProduct = await productModel.deleteOne({ _id: id });

    if (deleteProduct.deletedCount > 0) {
      res
        .status(200)
        .json({ response: "Delete product complete!", type: true });
    } else {
      res.status(200).json({ response: "Error Delete product!", type: false });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
