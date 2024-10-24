const mongoose = require("mongoose");
const typeProductSchema = new mongoose.Schema({
  type: String,
});

const typeProductModel = mongoose.model("type_products", typeProductSchema);
module.exports = typeProductModel;
