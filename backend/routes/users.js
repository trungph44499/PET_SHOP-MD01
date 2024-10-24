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
        res.status(200).json({ response: "Đăng ký thành công", type: true });
      } else {
        res.status(200).json({ response: "Đăng ký thất bại", type: false });
      }
    } else {
      res.status(200).json({ response: "Tài khoản đã tồn tại!", type: false });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  try {
    const checkUserLogin = await userModel.find({ email: email, pass: pass });

    if (checkUserLogin.length != 0) {
      res.status(200).json({ response: "Đăng nhập thành công", type: true });
    } else {
      res.status(200).json({ response: "Đăng nhập thất bại", type: false });
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

router.post("/getAllUser", async (req, res) => {
  try {
    const result = await userModel.find({});

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await userModel.deleteOne({ email: email });

    if (result.deletedCount > 0) {
      res.status(200).json({ response: "Delete complete", type: true });
      return;
    }
    res.status(200).json({ response: "Error delete", type: false });
  } catch (error) {
    console.log(error);
  }
});

router.post("/update", async (req, res) => {
  var fullname = req.body.fullname ?? "";
  var email = req.body.email;
  var password = req.body.password ?? "";
  var avatar = req.body.avatar ?? "";

  try {
    const result = await userModel.findOne({ email: email });
    if (fullname === "") fullname = result.fullname;
    if (password === "") password = result.pass;
    if (avatar === "") avatar = result.avatar;

    const updateUser = await userModel.updateOne(
      { email: email },
      {
        fullname: fullname,
        pass: password,
        avatar: avatar,
      }
    );
    if (updateUser.matchedCount > 0) {
      res.status(200).json({ response: "Update complete", type: true });
      return;
    }
    res.status(200).json({ response: "Error Update", type: false });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

