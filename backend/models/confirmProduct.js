const mongoose = require("mongoose");
const confirmProductSchema = new mongoose.Schema({
  emailUser: String,
  status: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  products: [],
});

const confirmProductModel = mongoose.model(
  "confirm_products",
  confirmProductSchema
);
module.exports = confirmProductModel;
