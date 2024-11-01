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
    const findAdmin = await adminModel.findOne({
      username: username,
      password: password,
    });
    if (findAdmin != null) {
      if (findAdmin.type == "admin") {
        res.status(200).json({
          isAdmin: true,
          response: "Admin login complete",
          type: true,
        });
        return;
      }
      res
        .status(200)
        .json({ isAdmin: false, response: "Staff login complete", type: true });
      return;
    }
    res
      .status(200)
      .json({ isAdmin: false, response: "Login failed", type: false });
  } catch (error) {
    console.log(error);
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

module.exports = router;
