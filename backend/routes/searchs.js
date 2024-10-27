const express = require("express");
const router = express.Router();
const productModel = require("../models/productModel");
const searchModel = require("../models/searchModel");

// Tìm kiếm sản phẩm
router.get("/", async (req, res) => {
    const { txt, emailUser } = req.query; // Lấy emailUser từ query


    try {
        // Tìm sản phẩm theo tên bắt đầu bằng chữ cái (sử dụng regex)
        const products = await productModel.find({ name: new RegExp(`^${txt}`, 'i') }); // Tìm kiếm bắt đầu bằng txt

        // Lưu lịch sử tìm kiếm vào MongoDB
        const searchEntry = new searchModel({
            emailUser,
            txt: txt
        });
        await searchEntry.save();
        // Log tên sản phẩm tìm kiếm
        console.log("Tên sản phẩm tìm kiếm:", txt);

        // Trả về kết quả tìm kiếm
        res.status(200).json({ 
            total: products.length, 
            response: products.length > 0 ? products : [], 
            message: products.length === 0 ? "Không tìm thấy sản phẩm nào!" : "" 
        });
    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ response: "Có lỗi xảy ra trong quá trình tìm kiếm. Vui lòng thử lại sau!" });
    }
});

// Lấy lịch sử tìm kiếm
router.get("/history", async (req, res) => {
    const { emailUser } = req.query;

    if (!emailUser) {
        return res.status(400).json({ response: "Vui lòng cung cấp email!" });
    }

    try {
        const history = await searchModel.find({ emailUser });
        res.status(200).json(history);
    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ response: "Có lỗi xảy ra khi lấy lịch sử tìm kiếm." });
    }
});

// routes/searchRoutes.js
router.delete("/:_id", async (req, res) => {
    const { _id } = req.params;

    try {
        await searchModel.findByIdAndDelete(_id);
        res.status(200).json({ response: "Đã xóa lịch sử tìm kiếm!" });
    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ response: "Có lỗi xảy ra khi xóa!" });
    }
});

module.exports = router;
