const express = require("express");
const router = express.Router();
const adminModel = require("../models/adminModel");

router.post("/", async (req, res) => {
  try {
    const getListAdmin = await adminModel.find({});
    const result = getListAdmin.filter((item) => item.username != "admin");
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Tìm admin theo username và password
    const findAdmin = await adminModel.findOne({
      username: username,
      password: password,
    });

    if (findAdmin != null) {
      // Kiểm tra loại người dùng (admin hay nhân viên)
      if (findAdmin.type == "admin") {
        // Trả về id của admin cùng với các thông tin khác
        res.status(200).json({
          isAdmin: true,
          response: "Đăng nhập admin thành công!",
          type: true,
          id: findAdmin._id,  // Lấy id của admin
        });
        return;
      }
      res.status(200).json({
        isAdmin: false,
        response: "Đăng nhập nhân viên thành công!",
        type: true,
        id: findAdmin._id,  // Lấy id của nhân viên
      });
      return;
    }

    res.status(200).json({
      isAdmin: false,
      response: "Đăng nhập thất bại!",
      type: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      response: "Lỗi server!",
    });
  }
});


router.post("/add", async function (req, res) {
  const { fullname, username, password } = req.body;

  try {
    const checkAdminExist = await adminModel.find({ username: username });

    if (checkAdminExist.length > 0) {
      res.status(200).json({ response: "Staff exist!", type: false });
      return;
    }

    const addAdmin = await adminModel.insertMany({
      fullname: fullname,
      username: username,
      password: password,
    });

    if (addAdmin.length > 0) {
      res.status(200).json({ response: "Add staff complete!", type: true });
      return;
    }

    res.status(200).json({ response: "Error add staff!", type: false });
  } catch (error) {
    console.log(error);
  }
});

router.post("/update", async function (req, res) {
  var username = req.body.username;
  var fullname = req.body.fullname ?? "";
  var password = req.body.password ?? "";
  var status = req.body.status ?? "";

  try {
    const findAdmin = await adminModel.find({ username: username });
    if (fullname === "") fullname = findAdmin.fullname;
    if (password === "") password = findAdmin.password;
    if (status === "") status = findAdmin.status;

    const updateAdmin = await adminModel.updateOne(
      { username: username },
      {
        fullname: fullname,
        password: password,
        status: status,
      }
    );

    if (updateAdmin.matchedCount > 0) {
      res.status(200).json({ response: "Update staff complete!", type: true });
      return;
    }

    res.status(200).json({ response: "Error update staff!", type: false });
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete", async function (req, res) {
  const { username } = req.body;
  try {
    const checkAdminExist = await adminModel.deleteOne({ username: username });

    if (checkAdminExist.deletedCount > 0) {
      res.status(200).json({ response: "Delete complete!", type: true });
      return;
    }

    res.status(200).json({ response: "Error remove staff!", type: false });
  } catch (error) {
    console.log(error);
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Lấy ID từ URL params
  try {
    const admin = await adminModel.findById(id);
    if (admin) {
      res.status(200).json({ response: admin }); // Trả về thông tin admin nếu tìm thấy
    } else {
      res.status(404).json({ response: "Không tìm thấy admin!" }); // Nếu không tìm thấy admin
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "Có lỗi xảy ra!" }); // Trả về lỗi server nếu có
  }
});


module.exports = router;
