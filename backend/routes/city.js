const express = require("express");
const router = express.Router();
const City = require("../models/citysModel"); // Đảm bảo mô hình cityModel đã được định nghĩa đúng

// Lấy tất cả thành phố
router.get("/", async (req, res) => {
  try {
    const cities = await City.find({});
    res.status(200).json(cities);
  } catch (error) {
    console.error("Error fetching cities: ", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi lấy thành phố" });
  }
});

module.exports = router;