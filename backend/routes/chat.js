const express = require("express");
const router = express.Router();
const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel");

router.post("/updateNumberMessage", async (req, res) => {
  const { email } = req.body;

  try {
    const updateStatusUser = await userModel.updateMany(
      {
        email: email,
      },
      {
        numberMessage: 0,
      }
    );
    res.status(200).json(updateStatusUser.matchedCount);
  } catch (error) {
    console.log(error);
  }
});

router.post("/add", async function (req, res) {
  try {
    const addMessages = await chatModel.insertMany(req.body);
    if (addMessages.length > 0) {
      const resultUser = await userModel.find({ email: req.body.email });
      const numberMessage = resultUser[0].numberMessage + 1;

      const updateStatusUser = await userModel.updateMany(
        {
          email: req.body.email,
        },
        {
          numberMessage: numberMessage,
        }
      );

      if (updateStatusUser.matchedCount > 0) {
        res.status(200).json(true);
        return;
      }

      return;
    }
    res.status(200).json(false);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async function (req, res) {
  const { email } = req.body;
  try {
    const getAllMessages = await chatModel.find({ email: email });
    res.status(200).json(getAllMessages);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
