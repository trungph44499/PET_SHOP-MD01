var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
const userModel = require("../models/userModel");

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail", // Hoặc dịch vụ email mà bạn đang sử dụng
  auth: {
    user: "zingkull29@gmail.com", // Thay thế bằng email của bạn
    pass: "hriz nkni nhdi gnme", // Thay thế bằng mật khẩu email của bạn
  },
});

// Đăng ký người dùng
router.post("/register", async (req, res) => {
  const { name, email, pass, sdt } = req.body;

  try {
    const checkEmailExist = await userModel.find({ email: email });

    if (checkEmailExist.length == 0) {
      const registerUser = await userModel.insertMany({
        fullname: name,
        email: email,
        pass: pass,
        sdt: sdt
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
      res.status(200).json({ response: "Tài khoản hoặc mật khẩu của bạn không chính xác", type: false });
    }
  } catch (error) {
    console.log(error);
  }
});

// Chức năng quên mật khẩu (gửi mã OTP)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ response: "Email không tồn tại", type: false });
    }

    // Gửi email với OTP
    const mailOptions = {
      from: "zingkull29@gmail.com",
      to: email,
      subject: "Mã OTP đặt lại mật khẩu",
      text: `Mã OTP của bạn là: ${req.body.otp}`, // Lấy OTP từ request
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ response: "Gửi email thất bại", type: false });
      }

      res.status(200).json({ response: "Mã OTP đã được gửi", type: true });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "Đã xảy ra lỗi", type: false });
  }
});

// Chức năng đặt lại mật khẩu (kiểm tra mã OTP)
router.post("/reset-password", async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    // Tìm người dùng dựa trên email
    const user = await userModel.findOne({ email: email });

    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return res
        .status(404)
        .json({ response: "Người dùng không tồn tại", type: false });
    }

    // Kiểm tra mã OTP
    if (user.otp !== otp) {
      return res
        .status(400)
        .json({ response: "Mã OTP không hợp lệ", type: false });
    }

    // Cập nhật mật khẩu mới
    user.pass = password; // Cập nhật mật khẩu mới
    user.otp = undefined; // Xóa mã OTP
    await user.save();

    res
      .status(200)
      .json({ response: "Mật khẩu đã được đặt lại thành công", type: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ response: "Đã xảy ra lỗi", type: false });
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
  var sdt = req.body.sdt ?? "";

  try {
    const result = await userModel.findOne({ email: email });
    if (fullname === "") fullname = result.fullname;
    if (password === "") password = result.pass;
    if (avatar === "") avatar = result.avatar;
    if (sdt === "") sdt = result.sdt;

    const updateUser = await userModel.updateOne(
      { email: email },
      {
        fullname: fullname,
        pass: password,
        avatar: avatar,
        sdt: sdt,
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

