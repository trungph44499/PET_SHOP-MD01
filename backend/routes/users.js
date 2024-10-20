var express = require("express");
var router = express.Router();
const userModel = require("../models/userModel");

router.post("/register", async (req, res) => {
  const { name, email, pass } = req.body;
  try {
    const checkEmailExist = await userModel.find({ email: email });
    if (checkEmailExist.length == 0) {
      const registerUser = await userModel.insertMany({
        fullname: name,
        email: email,
        pass: pass,
      });
      if (registerUser.length != 0) {
        res.status(200).json({ response: "Register complete", type: true });
      } else {
        res.status(200).json({ response: "Error register", type: true });
      }
    } else {
      res.status(200).json({ response: "User exist", type: false });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const checkUserLogin = await userModel.find({ email: email, pass: pass });
    if (checkUserLogin != 0) {
      res.status(200).json({ response: "User incorrect", type: false });
    } else {
      res.status(200).json({ response: "Login complete", type: true });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/getUser", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await userModel.find({ email: email });
    res.status(200).json({ response: result });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
