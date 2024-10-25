const express = require("express");
const router = express.Router();
const typeProductModel = require("../models/typeProductModel");
const productModel = require("../models/productModel");

router.post("/add", async (req, res) => {
  const { type } = req.body;

  try {
    const checkExist = await typeProductModel.findOne({ type: type });

    if (checkExist != null) {
      res.status(200).json({
        response: "Type exist!",
        type: false,
        id:checkExist._id ,
      });
      return;
    }

    const result = await typeProductModel.insertMany({
      type: type,
    });

    if (result.length > 0) {
      res.status(200).json({
        response: "Add new type complete!",
        type: true,
        id: result[0]._id,
      });
      return;
    }

    res.status(200).json({
      response: "Add new type error!",
      type: false,
      id: 0,
    });
    
  } catch (error) {
    console.log();
  }
});


router.post("/delete", async function (req, res) {
  const { id } = req.body;

  try {
    const checkTypeUsed = await productModel.find({ type: id });
    if (checkTypeUsed.length > 0) {
      res.status(200).json({ response: "Type used!", type: false });
      return;
    }

    const deleteType = await typeProductModel.deleteOne({ _id: id });
    if (deleteType.deletedCount > 0) {
      res.status(200).json({ response: "Delete type complete!", type: true });
      return;
    }

    res.status(200).json({ response: "Error delete type!", type: false });
  } catch (error) {
    console.log(error);
  }
});

router.post("/get", async function (req, res) {
  const { id } = req.body;
  try {
    const getType = await typeProductModel.findOne({ _id: id });

    if (getType != null) {
      res.status(200).json({ response: "", type: true, data: getType });
      return;
    }

    res
      .status(200)
      .json({ response: "Error remove staff!", type: false, data: {} });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async function (req, res) {
  try {
    const getAllType = await typeProductModel.find({});

    res.status(200).json(getAllType);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
