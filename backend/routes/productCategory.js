const express = require("express");
const router = express.Router();
const productCategory = require("../models/productCategoryModel");

// Lấy tất cả sản phẩm
router.get("/", async (req, res) => {
    try {
        const getProducts = await productCategory.find({});
        res.status(200).send({ response: getProducts });
    } catch (error) {
        console.log(error);
        res.status(500).send({ response: "Có lỗi xảy ra!" });
    }
});

// Lấy thông tin sản phẩm theo ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await productCategory.findById(id);
        if (product) {
            res.status(200).json({ response: product });
        } else {
            res.status(404).json({ response: "Không tìm thấy sản phẩm!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ response: "Có lỗi xảy ra!" });
    }
});


router.post("/add", async (req, res) => {
    var img = req.body.image ?? "";
    var name = req.body.name ?? "";

    try {
        const addProduct = await productCategory.insertMany({
            img: img,
            name: name,

        });
        if (addProduct.length > 0) {
            res.status(200).json({ response: "Thêm loại sản phẩm thành công!", type: true });
        } else {
            res.status(200).json({ response: "Lỗi thêm loại sản phẩm!", type: false });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post("/update", async (req, res) => {
    var id = req.body.id;
    var img = req.body.image ?? "";
    var name = req.body.name ?? "";

    try {
        const updateProduct = await productCategory.findByIdAndUpdate(id, {
            img: img,
            name: name,
        });
        if (updateProduct != null) {
            res
                .status(200)
                .json({ response: "Cập nhật loại sản phẩm thành công!", type: true });
        } else {
            res.status(200).json({ response: "Lỗi cập nhật loại sản phẩm!", type: false });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post("/delete", async (req, res) => {
    var id = req.body.id;
    try {
        const deleteProduct = await productCategory.deleteOne({ _id: id });
        if (deleteProduct.deletedCount > 0) {
            res
                .status(200)
                .json({ response: "Xóa loại sản phẩm thành công!", type: true });
        } else {
            res.status(200).json({ response: "Lỗi xóa loại sản phẩm!", type: false });
        }
    } catch (error) {
        console.log(error);
    }
});
// Cập nhật trạng thái (chỉ status)
router.post("/update-status", async (req, res) => {
    var id = req.body.id;
    var status = req.body.status;

    try {
        const updatedProductCategory = await productCategory.findByIdAndUpdate(
            id,
            { status: status },
            { new: true } // Trả về đối tượng đã được cập nhật
        );

        if (updatedProductCategory) {
            res.status(200).json({ response: "Cập nhật trạng thái loại sản phẩm thành công!", type: true });
        } else {
            res.status(200).json({ response: "Lỗi cập nhật trạng thái loại sản phẩm!", type: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ response: "Có lỗi xảy ra!" });
    }
});


module.exports = router;